import mongoose from "mongoose";

export default async function connect<Promise>() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    return new Promise<void>((resolve, reject) => {
      resolve();
    });
  } catch (err) {
    return new Promise<void>((resolve, reject) => {
      reject(err);
    });
  }
}
