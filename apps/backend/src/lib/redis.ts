import { createClient, RedisClientType } from "redis";
import { env } from "src/config/env";

declare global {
  var redis: RedisClientType;
}

let redisClient: RedisClientType;

if (!global.redis) {
  redisClient = createClient({
    url: env.REDIS_URL,
  });

  redisClient.on("error", (err) => {
    console.error("Redis Error:", err);
  });

  await redisClient.connect();
  console.log("✅ Redis connected");

  global.redis = redisClient;
} else {
  redisClient = global.redis;
}

export default redisClient;
