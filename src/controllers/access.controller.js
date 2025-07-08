import { CREATED } from "../core/response-handler/success.response.js";
import accessServices from "../services/access.service.js";

class AccessController {
  signUp = async (req, res) => {
    // return res.status(201).json(await accessServices.signUp(req.body));
    new CREATED({
      message: "Registered OK!",
      metadata: await accessServices.signUp(req.body),
    }).send(res);
  };
}

const accessController = new AccessController();

export default accessController;
