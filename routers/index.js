import express from "express";
import accessController from "../controllers/access.controller.js";

const router = express.Router();

router.get("/a", (_, res) => {
  res.status(200).json({
    message: "Ahhh shiba",
  });
});

router.post("/api/sign-up", accessController.signUp);

export default router;
