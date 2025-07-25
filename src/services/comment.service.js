import { NotFoundError } from "../core/response-handler/error.response.js";
import { convertObjectIdMongodb, getSelectData } from "../core/utils/object.js";
import commentModel from "../models/comment.model.js";

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
}

export default CommentService;
