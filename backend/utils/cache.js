import redis from "../config/redis.js";

export const getCache = async (key) => {
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
};

export const setCache = async (key, value, ttlSeconds) => {
  await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
};

export const deleteCache = async (key) => {
  await redis.del(key);
};
