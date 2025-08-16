// const logger = winston.createLogger({
//   level: process.env.LOG_LEVEL || "debug",
//   format: combine(
//     timestamp({
//       format: "YYYY-MM-DD hh: mm: ss. SSS A",
//     }),
//     align(),
//     printf((info) => `${info.level}: ${[info.timestamp]}: ${info.message}`)
//   ),
//   transport: {
//     new winston.transports.Console(),
//     new winston.transports.File({ filename: "combined.log", dirname: 'logs' }),
//   }
// });
