import { OK } from "../core/response-handler/success.response.js";

class ProfileController {
  profiles = async (req, res, next) => {
    new OK({
      message: "View all profiles successfully!",
      metadata: {
        user: "shiba",
      },
    }).send(res);
  };

  profile = async (req, res, next) => {
    new OK({
      message: "View all profiles successfully!",
      metadata: {
        user: "shiba1",
      },
    }).send(res);
  };
}

export default new ProfileController();
