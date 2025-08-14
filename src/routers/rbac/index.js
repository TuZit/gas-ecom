import express from "express";

import { asyncHandler } from "../../helpers/asyncHandler.js";
import {
  newResource,
  newRole,
  listResources,
  listRoles,
} from "../../controllers/rbac.controller.js";

const router = express.Router();

router.get("/resources", asyncHandler(listResources));
router.post("/resource", asyncHandler(newResource));

router.post("/role", asyncHandler(newRole));
router.get("/roles", asyncHandler(listRoles));

export default router;
