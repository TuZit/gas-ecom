import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";
import { v4 as uuidv4 } from "uuid";

/**
 * Implement logging dung lượng lớn với file
 * Ghi log theo ngày, giờ, ...
 */
class WinstonLoggerV2 {
  constructor() {
    const formatPrint = format.printf(
      ({ message, level, context, requestId, timestamp, metadata }) => {
        return `${timestamp}::${level}::${context}::${requestId}::${JSON.stringify(
          metadata
        )}::${message}}`;
      }
    );

    this.logger = createLogger({
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        formatPrint
      ),
      transports: [
        new transports.Console(),
        new transports.DailyRotateFile({
          dirname: "src/logs",
          level: "info",
          filename: "application-%DATE%.info.log",
          datePattern: "YYYY-MM-DD-HH-mm",
          zippedArchive: true, // backup log zipped archive
          maxSize: "20m", // vượt quá 20Mb thì tạo ra file mới
          maxFiles: "14d", // nếu đặt thì sẽ xóa log trong vòng 14 ngày
          format: format.combine(
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            formatPrint
          ),
        }),
        new transports.DailyRotateFile({
          dirname: "src/logs",
          level: "error",
          filename: "application-%DATE%.error.log",
          datePattern: "YYYY-MM-DD-HH-mm",
          zippedArchive: true, // backup log zipped archive
          maxSize: "20m", // vượt quá 20Mb thì tạo ra file mới
          maxFiles: "14d", // nếu đặt thì sẽ xóa log trong vòng 14 ngày
          format: format.combine(
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            formatPrint
          ),
        }),
      ],
    });
  }

  getLogger() {
    return this.logger;
  }

  commonParam(params) {
    let context, req, metadata;
    if (!Array.isArray(params)) {
      context = params.context;
      metadata = params.metadata;
    } else {
      [context, req, metadata] = params;
    }

    const requestId = req?.requestId || uuidv4();
    return {
      requestId,
      context,
      metadata,
    };
  }

  log(message, param) {
    const logParams = this.commonParam(param);
    const logObject = Object.assign({ message }, logParams);
    this.logger.info(logObject);
  }

  error(message, param) {
    const logParams = this.commonParam(param);
    const logObject = Object.assign({ message }, logParams);
    this.logger.error(logObject);
  }
}

export default new WinstonLoggerV2();
