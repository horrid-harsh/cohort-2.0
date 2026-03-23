import { Mistral } from "@mistralai/mistralai";

const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

/**
 * Generates a 1024-dimension embedding vector for a given text.
 * Uses Mistral's "mistral-embed" model.
 *
 * @param {string} text - The text to embed
 * @returns {number[]} - Array of 1024 numbers representing meaning
 */
export const generateEmbedding = async (text) => {
  if (!text || text.trim().length === 0) return null;

  const response = await mistral.embeddings.create({
    model: "mistral-embed",
    inputs: [text.trim()],
  });

  return response.data[0].embedding; // array of 1024 numbers
};

/**
 * Builds the text we'll embed from a save's metadata.
 * More context = better semantic matching.
 *
 * @param {object} save - Mongoose save document
 * @param {string[]} tagNames - Array of tag name strings
 * @returns {string}
 */
export const buildEmbedText = (save, tagNames = []) => {
  const parts = [
    save.title,
    save.description,
    save.siteName,
    save.type,
    tagNames.join(" "),
    save.content?.slice(0, 2000),
  ].filter(Boolean); // removes undefined/null/empty

  return parts.join(" ").trim();
};

/**
 * Cosine similarity between two vectors.
 * Returns a value from -1 (opposite) to 1 (identical).
 * We treat > 0.75 as a good semantic match.
 *
 * @param {number[]} a
 * @param {number[]} b
 * @returns {number}
 */
export const cosineSimilarity = (a, b) => {
  if (!a || !b || a.length !== b.length) return 0;

  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  const magnitude = Math.sqrt(magA) * Math.sqrt(magB);
  if (magnitude === 0) return 0;

  return dot / magnitude;
};