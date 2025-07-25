import { OK } from "../core/response-handler/success.response.js";
import CommentService from "../services/comment.service.js";

class CommentController {
  async createComment(req, res, next) {
    new OK({
      message: "Create new comment successfully!",
      metadata: await CommentService.createComment({
        ...req.body,
      }),
    }).send(res);
  }

  async getAllComments(req, res, next) {
    new OK({
      message: "Get All Comments!",
      metadata: await CommentService.getAllComments(),
    }).send(res);
  }

  async getCommentByParentId(req, res, next) {
    new OK({
      message: "Get Comments By ParentID!",
      metadata: await CommentService.getCommentByParentId(req.body),
    }).send(res);
  }

  async deleteComment(req, res, next) {
    new OK({
      message: "Deleted comment",
      metadata: await CommentService.deleteComments(req.body),
    }).send(res);
  }
}

export default new CommentController();
