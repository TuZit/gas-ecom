import { CREATED, OK } from "../core/response-handler/success.response.js";
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
    new OK({
      message: "Login successfully!",
      metadata: await AccessServices.login(req.body),
    }).send(res);
  };

  logout = async (req, res, next) => {
    new OK({
      message: "Logout successfully!",
      metadata: await AccessServices.logout({ keyStore: req.keyStore }),
    }).send(res);
  };

  handleRefreshToken = async (req, res, next) => {
    new OK({
      message: "Refresh token successfully!",
      metadata: await AccessServices.handleRefreshToken(req.body.refreshToken),
    }).send(res);
  };
}

const accessController = new AccessController();

export default accessController;
