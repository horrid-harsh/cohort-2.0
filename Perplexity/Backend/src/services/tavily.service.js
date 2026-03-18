import { tavily } from "@tavily/core";
import logger from "../utils/logger.js";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

/**
 * Searches the web using Tavily API
 * @param {string} query - The search query
 * @param {Object} options - Optional Tavily search options
 * @returns {Promise<Object>} Tavily search response
 */
export async function search(query, options = {}) {
  try {
    const response = await tvly.search(query, {
      searchDepth: "advanced",
      maxResults: 6,
      includeAnswer: false,
      ...options,
    });
    return response;
  } catch (error) {
    logger.error(`Tavily Search Error: ${error.message}`);
    // Return empty results instead of crashing the request
    return { results: [] };
  }
}
