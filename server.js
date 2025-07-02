import app from "./app.js";

const PORT = 3005;

const server = app.listen(PORT, () => {
  console.log("App running on port: ", PORT);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server exited");
  });
});
