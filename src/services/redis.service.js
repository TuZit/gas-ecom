import redis from "redis";
import { promisify } from "util";
import { reservationInventory } from "../models/repositories/inventory.repository.js";

const redisClient = redis.createClient({});

const pexpire = promisify(redisClient.pExpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

// nhiệm vụ giữ lại key khi mà 1 người đg thanh toán
// nếu người khác vào thanh toán với Product đó sẽ cố thử lại 10 lần
export const acquireLock = async (productId, cartId, quantity) => {
  const keyLock = `lock_v2025_${productId}`;
  const retryTime = 10;
  const expiredTime = 3000; // 3s tạm khóa

  for (let i = 0; i < retryTime; i++) {
    // tạo 1 key, ai đg giữ key sẽ đc thanh toán
    const result = await setnxAsync(keyLock, expiredTime);
    console.log(result);
    if (result === 1) {
      // Xử lý Inventory
      const isReversation = await reservationInventory({
        cartId,
        productId,
        quantity,
      });
      console.log("isReversation", isReversation);
      if (isReversation.modifiedCount) {
        await pexpire(keyLock, expiredTime);
        return keyLock;
      }

      return keyLock;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

export const releaseLock = async (keyLock) => {
  const delKey = await promisify(redisClient.del).bind(redisClient);
  return await delKey(keyLock);
};
