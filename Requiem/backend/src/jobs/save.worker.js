import { Worker } from "bullmq";
import { connection } from "../config/redis.js";
import { SaveModel } from "../models/save.model.js";
import { scrapeUrl } from "../services/scraper.service.js";
import { embedSave } from "../services/embedSave.service.js";
import { autoTagSave } from "../services/autoTag.service.js";
import connectDB from "../config/db.js";
import mongoose from "mongoose";

// Only connect if not already connected (e.g., when running standalone)
if (mongoose.connection.readyState === 0) {
  connectDB();
}

const worker = new Worker(
  "save-queue",
  async (job) => {
    const { saveId, userId } = job.data;
    // console.log(`[Worker] 🛠️ Processing save: ${saveId}`);

    try {
      // 1. Mark as processing
      await SaveModel.findByIdAndUpdate(saveId, { processingStatus: "processing" });

      const save = await SaveModel.findById(saveId);
      if (!save) throw new Error("Save not found");

      // 2. Auto-tag (Heavy)
      // console.log(`[Worker] 🏷️ Auto-tagging...`);
      await autoTagSave(save, userId);

      // 3. Generate Embeddings (Heavy)
      // console.log(`[Worker] 🧠 Generating embeddings...`);
      await embedSave(saveId, userId);

      // 4. Finalize
      await SaveModel.findByIdAndUpdate(saveId, {
        processingStatus: "completed",
      });

      // console.log("✅ Background tasks done:", saveId);
    } catch (err) {
      console.error("❌ Worker Job Failed:", err.message);
      await SaveModel.findByIdAndUpdate(saveId, { processingStatus: "failed" });
      throw err;
    }
  },
  { connection }
);

// console.log("🚀 Save Worker initialized");