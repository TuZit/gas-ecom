import accessServices from "../services/access.service.js";

class AccessController {
  signUp = async (req, res) => {
    return res.status(201).json(await accessServices.signUp(req.body));
  };
}

const accessController = new AccessController();

export default accessController;
