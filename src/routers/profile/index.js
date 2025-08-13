import express from "express";

import { asyncHandler } from "../../helpers/asyncHandler.js";
import profileController from "../../controllers/profile.controller.js";
import { grantAccess } from "../../middleware/rbac.js";

const router = express.Router();

/*---------- authentication ----------*/
// router.use(authenticationV2);

// admin
router.get(
  "/viewAny",
  grantAccess("readAny", "profile"),
  asyncHandler(profileController.profiles)
);

// shop
router.get(
  "/viewOwn",
  grantAccess("readOwn", "profile"),
  asyncHandler(profileController.profile)
);

export default router;
