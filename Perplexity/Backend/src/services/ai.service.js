import { ChatMistralAI } from "@langchain/mistralai"
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { search } from "./tavily.service.js";
import logger from "../utils/logger.js";

const model = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
  temperature: 0.7,
  maxOutputTokens: 2048,
});

const SYSTEM_PROMPT = `You are a helpful AI assistant similar to Perplexity AI. Your role is to answer questions accurately and concisely using the web search results provided to you.

Guidelines:
- Always base your answers on the search results provided in the context
- Cite sources naturally within your response when referencing specific information
- If the search results don't contain enough information, say so honestly
- Keep responses focused, clear, and well-structured
- Use markdown formatting for better readability (headers, bullet points, bold text)
- For follow-up questions, consider the previous conversation context`;

/**
 * Builds LangChain message history from stored DB messages
 * @param {Array} history - Array of message documents from DB
 */
function buildMessageHistory(history) {
  return history.map((msg) => {
    if (msg.role === "user") return new HumanMessage(msg.content);
    return new AIMessage(msg.content);
  });
}

/**
 * Formats Tavily search results into a context string for the model
 * @param {Array} results - Tavily search results
 */
function formatSearchContext(results) {
  if (!results?.length) return "";

  return results
    .slice(0, 5)
    .map(
      (r, i) =>
        `[Source ${i + 1}]: ${r.title}\nURL: ${r.url}\nContent: ${r.content}`
    )
    .join("\n\n");
}

/**
 * Generates an AI response with web search context and conversation history
 * @param {string} query - The user's query
 * @param {Array} history - Previous messages for context
 * @returns {{ answer: string, sources: Array }}
 */
export async function generateAiResponse(query, history = []) {
  try {
    // Perform web search
    const searchResults = await search(query);
    const results = searchResults?.results || [];

    // Build search context
    const searchContext = formatSearchContext(results);

    // Extract sources for the response
    const sources = results.slice(0, 5).map((r) => ({
      title: r.title,
      url: r.url,
      favicon: `https://www.google.com/s2/favicons?domain=${new URL(r.url).hostname}&sz=32`,
    }));

    // Build the messages array
    const messages = [
      new SystemMessage(SYSTEM_PROMPT),
      ...buildMessageHistory(history),
      new HumanMessage(
        searchContext
          ? `Web Search Results:\n\n${searchContext}\n\n---\n\nUser Question: ${query}`
          : query
      ),
    ];

    const response = await model.invoke(messages);
    const answer = response.content;

    return { answer, sources };
  } catch (error) {
    logger.error(`AI Service Error: ${error.message}`);
    throw error;
  }
}
