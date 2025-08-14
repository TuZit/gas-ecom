import { OK } from "../core/response-handler/success.response.js";
import {
  createResource,
  createRole,
  getListRoles,
  getResourceList,
} from "../services/rbac.service.js";

const newResource = async (req, res, next) => {
  new OK({
    message: "Create new resource successfully!",
    metadata: await createResource({ ...req.body }),
  }).send(res);
};
const newRole = async (req, res, next) => {
  new OK({
    message: "Create new role successfully!",
    metadata: await createRole({ ...req.body }),
  }).send(res);
};
const listResources = async (req, res, next) => {
  new OK({
    message: "Get list resource successfully!",
    metadata: await getResourceList({ ...req.body }),
  }).send(res);
};
const listRoles = async (req, res, next) => {
  new OK({
    message: "Get list roles successfully!",
    metadata: await getListRoles({ ...req.body }),
  }).send(res);
};

export { newResource, newRole, listResources, listRoles };
