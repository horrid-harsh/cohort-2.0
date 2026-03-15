import { TagModel } from "../models/tag.model.js";
import { SaveModel } from "../models/save.model.js";
import { suggestTags } from "./ai.service.js";

// Main function — call this after a save is created
const autoTagSave = async (save, userId) => {
  try {
    // Get tag suggestions from Gemini
    const suggestedNames = await suggestTags({
      title: save.title,
      description: save.description,
      url: save.url,
    });

    if (!suggestedNames.length) return;

    const tagIds = [];

    for (const name of suggestedNames) {
      // findOneAndUpdate with upsert = find existing or create new
      // This prevents duplicate tags for same user
      const tag = await TagModel.findOneAndUpdate(
        { user: userId, name },
        { user: userId, name, isAiGenerated: true },
        { upsert: true, returnDocument: "after" }
      );
      tagIds.push(tag._id);
    }

    // Attach tags to the save (addToSet avoids duplicates)
    await SaveModel.findByIdAndUpdate(save._id, {
      $addToSet: { tags: { $each: tagIds } },
    });

    console.log(`✅ Auto-tagged save "${save.title}" with: ${suggestedNames.join(", ")}`);
  } catch (error) {
    // Never crash the save — log and move on
    console.error("Auto-tagging failed:", error.message);
  }
};

export { autoTagSave };
