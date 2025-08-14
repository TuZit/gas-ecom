import { AuthFailureError } from "../core/response-handler/error.response.js";
import { getListRoles } from "../services/rbac.service.js";
import AccessControl from "./role.middleware.js";

/**
 *
 * @param {string} action // read/delete/update
 * @param {*} resource  // profile/balance
 */
const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      AccessControl.setGrants(
        await getListRoles({
          userId: 9999,
        })
      );

      const role_name = req.query.role;
      const permission = AccessControl.can(role_name)[action](resource);
      console.log("shiba", permission);
      if (!permission.granted) {
        throw new AuthFailureError("You don't have any permission");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export { grantAccess };
