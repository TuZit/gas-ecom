import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";

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

app.get("/", (_, res) => {
  res.status(200).json({
    message: "Hello World",
    // data: "Shibaa".repeat(1000000),
  });
});

export default app;
