import { Queue } from "bullmq";
import { connection } from "../config/redis.js";

export const saveQueue = new Queue("save-queue", {
  connection,
});

export const addSaveJob = async (data) => {
  console.log("🏗️ [Queue] addSaveJob called with:", data);
  await saveQueue.add("process-save", data, {
    attempts: 3,
    removeOnComplete: true,
    removeOnFail: false,
  });
  console.log("🚀 [Queue] Job pushed to Redis");
};