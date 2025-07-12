import express from "express";
import { apiKey, checkPermission } from "../auth/checkAuth.js";

import accessRouter from "./access/index.js";
import productRouter from "./product/index.js";

const router = express.Router();

/*---------- check API key ----------*/
router.use(apiKey);

/*---------- permission ----------*/
router.use(checkPermission("0000"));

/*---------- product routes ----------*/
router.use(productRouter);

/*---------- access routers ----------*/
router.use(accessRouter);

export default router;
