// class NotificationService {

import notificationModel from "../models/notification.model.js";

// }

// export default NotificationService;

const pushNotiToSystem = async ({
  type = "SHOP-001",
  receivedId = 1,
  senderId = 1,
  options = {},
}) => {
  let noti_content;
  if (type === "SHOP-001") {
    noti_content = "Vừa mới tạo mới 1 product";
  } else if (type == "PROMOTION-001") {
    noti_content = "Vừa mới tạo mới 1discount";
  }

  const newNoti = await notificationModel.create({
    noti_type: type,
    noti_content,
    noti_senderId: senderId,
    noti_receivedId: receivedId,
    noti_options: options,
  });
  return newNoti;
};

const listNotifyByUser = async () => {};

const listNotiByUser = async ({ userId = 11111, type = "ALL", isRead = 0 }) => {
  const match = { noti_receivedId: userId };
  if (type != "ALL") {
    match["noti_type"] = type;
  }

  return await notificationModel.aggregate([
    { $match: match },
    {
      $project: {
        noti_type: 1,
        noti_senderId: 1,
        noti_receivedId: 1,
        noti_content: {
          $concat: [
            {
              $substr: ["$noti_options.shop_name", 0, -1],
            },
            " vừa mới thêm một sản phẩm mới: ",
            {
              $substr: ["$noti_options.product_name", 0, -1],
            },
          ],
        },
        createdAt: 1,
        noti_options: 1,
      },
    },
  ]);
};

export { pushNotiToSystem, listNotiByUser };
