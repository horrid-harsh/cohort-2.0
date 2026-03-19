import { TagModel } from "../models/tag.model.js";
import { SaveModel } from "../models/save.model.js";
import { suggestTags } from "./ai.service.js";

const TAG_COLORS = [
  "#6366f1", "#f43f5e", "#10b981", "#f59e0b",
  "#8b5cf6", "#14b8a6", "#3b82f6", "#eab308", "#ec4899",
];

const getColorForTag = (tagName) => {
  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
};

const autoTagSave = async (save, userId) => {
  try {
    // Fetch user's existing tags to pass to AI
    const existingTags = await TagModel.find({ user: userId }).select("name");
    const existingTagNames = existingTags.map((t) => t.name);

    // Get tag suggestions — with existing tags context
    const suggestedNames = await suggestTags({
      title: save.title,
      description: save.description,
      url: save.url,
      existingTags: existingTagNames,
    });

    if (!suggestedNames.length) return;

    const tagIds = [];

    for (const name of suggestedNames) {
      const tagColor = getColorForTag(name);
      const tag = await TagModel.findOneAndUpdate(
        { user: userId, name },
        {
          $set: { isAiGenerated: true },
          $setOnInsert: { color: tagColor },
        },
        { upsert: true, new: true }
      );
      tagIds.push(tag._id);
    }

    await SaveModel.findByIdAndUpdate(save._id, {
      $addToSet: { tags: { $each: tagIds } },
    });

    console.log(`✅ Auto-tagged "${save.title}" with: ${suggestedNames.join(", ")}`);
  } catch (error) {
    console.error("Auto-tagging failed:", error.message);
  }
};

export { autoTagSave };