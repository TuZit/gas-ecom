import { CREATED } from "../core/response-handler/success.response.js";
import AccessServices from "../services/access.service.js";

class AccessController {
  signUp = async (req, res) => {
    // return res.status(201).json(await AccessServices.signUp(req.body));
    new CREATED({
      message: "Registered OK!",
      metadata: await AccessServices.signUp(req.body),
    }).send(res);
  };

  login = async (req, res, next) => {
    new CREATED({
      message: "Login OK!",
      metadata: await AccessServices.login(req.body),
    }).send(res);
  };
}

const accessController = new AccessController();

export default accessController;
