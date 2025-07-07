import express from "express";
import accessController from "../controllers/access.controller.js";
import { apiKey, checkPermission } from "../auth/checkAuth.js";

const router = express.Router();

// using middleware check apiKey
router.use(apiKey);

// check permission
router.use(checkPermission("0000"));

router.get("/a", (_, res) => {
  res.status(200).json({
    message: "Ahhh shiba",
  });
});

router.post("/api/sign-up", accessController.signUp);

export default router;
