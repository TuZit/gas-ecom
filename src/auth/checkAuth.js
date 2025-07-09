import { findById } from "../services/apiKey.service.js";
import { HEADER } from "../core/constants/index.js";

export const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "API Key: Forbidden Error",
      });
    }

    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: "Obj Key: Forbidden Error",
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {
    console.error(error);
  }
};

export const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "Permission Denied",
      });
    }

    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        message: "Check Permission: Forbidden Error",
      });
    }
    return next();
  };
};
