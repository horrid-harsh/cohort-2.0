import { SaveModel } from "../models/save.model.js";
import { TagModel } from "../models/tag.model.js";
import { generateEmbedding, buildEmbedText } from "./embedding.service.js";

/**
 * Generates and stores an embedding for a save.
 * Called without await in controller — runs in background.
 *
 * @param {string} saveId
 * @param {string} userId
 */
export const embedSave = async (saveId, userId) => {
  try {
    // Fetch save with tags populated so we can include tag names in embed text
    const save = await SaveModel.findOne({ _id: saveId, user: userId }).select("+content");
    if (!save) return;

    // Get tag names for richer embedding context
    const tags = await TagModel.find({ _id: { $in: save.tags } }).select("name");
    const tagNames = tags.map((t) => t.name);

    // Build the text and generate the vector
    const text = buildEmbedText(save, tagNames);
    const embedding = await generateEmbedding(text);

    if (!embedding) return;

    // Store the vector in the save — select:false field
    await SaveModel.updateOne({ _id: saveId }, { $set: { embedding, embeddingVersion: 1 } });

    // console.log(`[embedSave] ✅ Embedded save ${saveId}`);
  } catch (err) {
    // Never crash the main request — just log
    console.error(`[embedSave] ❌ Failed for save ${saveId}:`, err.message);
  }
};