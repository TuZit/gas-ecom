import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";

import ProductTestRedisServicecond from "./src/test/product.test.js";
import inventoryServicePromise from "./src/test/inventory.test.js";

// Test pub-sub redis với cơ chế đồng bộ hóa chính xác
// Chúng ta sử dụng một IIFE (Immediately Invoked Function Expression) bất đồng bộ
// để đợi subscriber sẵn sàng trước khi publish.
(async () => {
  try {
    console.log("Waiting for inventory subscriber to be ready...");
    await inventoryServicePromise;
    console.log("Inventory subscriber is ready.");

    // Giờ thì subscriber đã sẵn sàng, chúng ta có thể publish một cách an toàn.
    console.log("--- Running Pub/Sub Test ---");
    await ProductTestRedisServicecond.purchaseProduct("product-1234", 10);
  } catch (err) {
    console.error("Failed to run pub/sub test:", err);
  }
})();

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
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack: err.stack,
    message,
  });
});

export default app;
