import { TagModel } from "../models/tag.model.js";
import { SaveModel } from "../models/save.model.js";
import { suggestTags } from "./ai.service.js";

const TAG_COLORS = [
  "#6366f1", // indigo
  "#f43f5e", // rose
  "#10b981", // emerald
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#14b8a6", // teal
  "#3b82f6", // blue
  "#eab308", // yellow
  "#ec4899", // pink
];

const getColorForTag = (tagName) => {
  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
};

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
      const tagColor = getColorForTag(name);

      const tag = await TagModel.findOneAndUpdate(
        { user: userId, name },
        { 
          $set: { isAiGenerated: true },
          $setOnInsert: { color: tagColor }
        },
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
