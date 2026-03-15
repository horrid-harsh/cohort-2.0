import Mistral from "@mistralai/mistralai";

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

const suggestTags = async ({ title, description, url }) => {
  try {
    const response = await client.chat.complete({
      model: "mistral-small-latest",
      messages: [
        {
          role: "user",
          content: `
You are a tagging assistant for a personal knowledge management app.
Suggest 3-5 short relevant tags for this saved content.

Title: ${title || ""}
Description: ${description || ""}
URL: ${url || ""}

Rules:
- Lowercase only
- 1-2 words max
- Generic and reusable
- Return ONLY a JSON array of strings
- Example: ["javascript", "react", "frontend"]
          `
        }
      ],
      responseFormat: { type: "json_object" },
    });

    const text = response.choices[0].message.content;
    const parsed = JSON.parse(text);

    // Mistral might return { tags: [...] } or just [...]
    const tags = Array.isArray(parsed) ? parsed : parsed.tags || [];

    return tags
      .filter((t) => typeof t === "string")
      .map((t) => t.toLowerCase().trim())
      .slice(0, 5);

  } catch (error) {
    console.error("Mistral tag suggestion failed:", error.message);
    return [];
  }
};

export { suggestTags };