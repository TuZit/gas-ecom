import mongoose from "mongoose";
import os from "os";
import process from "process";

const SECOND = 5000;

export const connectCount = () => {
  const count = mongoose.connections.length;
  console.log("Number of connections: ", count);
  return count;
};

// Monitor per 5s
export const checkOverload = () => {
  setInterval(() => {
    const numbConnection = connectCount();
    const numbCore = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    const maxConnections = numbCore * 5;

    console.log("Active connections: ", numbConnection);
    console.log("Memory usage: ", memoryUsage / 1024 / 1024);

    if (numbConnection > maxConnections) {
      console.log("Connection Overload detected");
      return false;
    }
  }, SECOND);
};
