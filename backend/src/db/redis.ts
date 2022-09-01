import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const client = createClient({
  url: process.env.REDIS_URL,
});
client.on("error", (err) => console.log("Redis Client Error", err));

export async function connectToRedis() {
  try {
    await client.connect();
    return new Promise<void>((resolve, reject) => {
      resolve();
    });
  } catch (err) {
    return new Promise<void>((resolve, reject) => {
      reject(err);
    });
  }
}
