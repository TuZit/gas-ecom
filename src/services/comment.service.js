import { NotFoundError } from "../core/response-handler/error.response.js";
import { convertObjectIdMongodb, getSelectData } from "../core/utils/object.js";
import commentModel from "../models/comment.model.js";
import { findProductByID } from "../models/repositories/product.repository.js";

// https://en.wikipedia.org/wiki/Nested_set_model

class CommentService {
  static async createComment({ productId, userId, content, parentId = null }) {
    const newComment = new commentModel({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentId,
    });

    let rightValue;
    if (parentId) {
      const parentComment = await commentModel.findById(parentId);
      if (!parentComment) {
        throw new NotFoundError("Parent comment not found");
      }

      rightValue = parentComment.comment_right;
      await commentModel.updateMany(
        {
          comment_productId: convertObjectIdMongodb(productId),
          comment_right: { $gte: rightValue },
        },
        {
          $inc: {
            comment_right: 2,
          },
        }
      );
    } else {
      const maxRightValue = await commentModel.findOne(
        {
          comment_productId: convertObjectIdMongodb(productId),
        },
        "comment_right",
        {
          sort: {
            comment_right: -1,
          },
        }
      );

      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }

    newComment.comment_left = rightValue;
    newComment.comment_right = rightValue + 1;

    await newComment.save();
    return newComment;
  }

  static async getAllComments() {
    return commentModel
      .find()
      .select(
        getSelectData([
          "comment_parentId",
          "comment_content",
          "comment_left",
          "comment_right",
        ])
      )
      .lean();
  }

  static async getCommentByParentId({
    parentId,
    productId,
    limit = 50,
    offset = 0,
  }) {
    if (parentId) {
      const parentComment = await commentModel.findById(parentId);
      if (!parentComment) throw new NotFoundError("Parent comment not found");

      const comments = await commentModel
        .find({
          comment_productId: convertObjectIdMongodb(productId),
          comment_left: { $gte: parentComment.comment_left },
          comment_right: { $lte: parentComment.comment_right },
        })
        .select({
          comment_parentId: 1,
          comment_content: 1,
          comment_left: 1,
          comment_right: 1,
        })
        .sort({ comment_left: 1 });
      return comments;
    }

    const parentComment = await commentModel.findById(parentId);
    if (!parentComment) throw new NotFoundError("Parent comment not found");

    const comments = await commentModel
      .find({
        comment_productId: convertObjectIdMongodb(productId),
        comment_parentId: convertObjectIdMongodb(parentId),
      })
      .select({
        comment_parentId: 1,
        comment_content: 1,
        comment_left: 1,
        comment_right: 1,
      })
      .sort({ comment_left: 1 });
    return comments;
  }

  static async deleteComments({ commentId, productId }) {
    const product = await findProductByID({ product_id: productId });
    if (!product) throw new NotFoundError("Product not found");

    const comment = await commentModel.findById(commentId);
    if (!comment) throw new NotFoundError("Comment not found");

    const leftValue = comment.comment_left;
    const rightValue = comment.comment_right;

    // calc width: tính độ rộng của tất cả comments muốn xoá, cả cha + con
    const width = rightValue - leftValue + 1;

    // delete: xoá tất cả comment con
    await commentModel.deleteMany({
      comment_productId: convertObjectIdMongodb(productId),
      comment_left: { $gte: leftValue, $lte: rightValue },
    });

    // update left, right còn lại của các node
    await commentModel.updateMany(
      {
        comment_productId: convertObjectIdMongodb(productId),
        comment_right: { $gt: rightValue },
      },
      {
        $inc: {
          comment_right: -width,
        },
      }
    );
    await commentModel.updateMany(
      {
        comment_productId: convertObjectIdMongodb(productId),
        comment_left: { $gt: rightValue },
      },
      {
        $inc: {
          comment_left: -width,
        },
      }
    );

    return comment;
  }
}

export default CommentService;
