import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";

// init db
import "./src/db/init.mongo.js";
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

// routers
app.use(router);

// handling errors
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  const message = error.message || "Internal Server Error";

  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message,
  });
});

export default app;
