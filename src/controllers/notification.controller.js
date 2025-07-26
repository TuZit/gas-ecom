import { OK } from "../core/response-handler/success.response.js";
import { listNotiByUser } from "../services/notification.service.js";

class NotificationController {
  async listNotiByUser(req, res, next) {
    new OK({
      message: "Get List Notification By User",
      metadata: await listNotiByUser({}),
    }).send(res);
  }
}

export default new NotificationController();
