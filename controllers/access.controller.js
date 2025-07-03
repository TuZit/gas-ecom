import accessServices from "../services/access.service.js";

class AccessController {
  signUp = async (req, res, next) => {
    try {
      const newShop = await accessServices.signUp(req.body);

      if (newShop.code !== 201) {
        return res.status(newShop.code).json({
          message: newShop.message,
          status: newShop.status,
        });
      }

      res.status(201).json({
        message: "Success",
        ...newShop,
      });
    } catch (error) {
      next(error);
    }
  };
}

const accessController = new AccessController();

export default accessController;
