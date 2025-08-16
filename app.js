import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import { v4 as uuidv4 } from "uuid";

import WinstonLoggerV2 from "./src/logger/winstonV2.log.js";
// init db
import "./src/core/db/init.mongo.js";
import router from "./src/routers/index.js";
// checkOverload();

const app = express();
// init middleware
app.use(morgan("dev")); /* LOG: GET / 200 2.100 ms - 12 */

// LOG: log theo chuẩn apache, nên xài cho PROD
// ::1 - - [02/Jul/2025:08:03:07 +0000] "GET / HTTP/1.1" 304 - "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36"
// app.use(morgan("combined"));

/* hidden server info */
app.use(helmet());

// nén data response
app.use(compression());

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const requestId = req.headers["x-request-id"] || uuidv4();
  req.requestId = requestId || uuidv4();
  WinstonLoggerV2.log(`Info::${req.method}`, [
    req.path,
    { requestId: req.requestId },
    req.method === "POST" ? req.body : req.query,
  ]);

  next();
});

// routers
app.use(router);

// handling errors
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  WinstonLoggerV2.error(`Info::${req.method}`, [
    req.path,
    { requestId: req.requestId },
    message,
  ]);
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack: err.stack,
    message,
  });
});

export default app;
