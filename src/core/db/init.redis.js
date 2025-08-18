import { createClient } from "redis";
import { RedisError } from "../response-handler/error.response.js";

const statusConnectRedis = {
  CONNECT: "connect",
  RECONNECT: "reconnecting",
  READY: "ready",
  ERROR: "error",
  END: "end",
};

const REDIS_CONNECTION_TIMEOUT = 10000,
  REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: "Service connection error",
  };
let connectionTimeout = null;

const handleTimeoutError = () => {
  connectionTimeout = setTimeout(() => {
    throw new RedisError({
      message: REDIS_CONNECT_MESSAGE,
      statusCode: REDIS_CONNECT_MESSAGE.code,
    });
  }, REDIS_CONNECTION_TIMEOUT);
};

class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on(statusConnectRedis.ERROR, (err) => {
      console.error("Redis Client Error", err);
      // retry connect
      handleTimeoutError();
    });
    this.client.on(statusConnectRedis.CONNECT, () => {
      console.log("Redis connected");
      clearTimeout(connectionTimeout);
    });
    this.client.on(statusConnectRedis.READY, () => {
      console.log("Redis client ready to use");
    });
    this.client.on(statusConnectRedis.END, () => {
      console.log("Redis client disconnected");
      handleTimeoutError();
    });
    this.client.on(statusConnectRedis.RECONNECT, () => {
      console.log("Redis client reconnecting");
      clearTimeout(connectionTimeout);
    });
    // Connect immediately when the module is loaded
    this.client.connect().catch(console.error);
  }

  static getInstance() {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }
}

const instance = RedisClient.getInstance();

const redisConnection = {
  instanceConnected: instance.client,
};

const getRedis = () => redisConnection;

const closeRedis = () => {
  if (redisConnection.instanceConnected) {
    redisConnection.instanceConnected.quit();
  }
};

export { getRedis, closeRedis };
