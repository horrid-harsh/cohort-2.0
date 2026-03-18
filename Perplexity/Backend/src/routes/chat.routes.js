import { Router } from "express";
import {
  getUserChats,
  createChat,
  getChatById,
  deleteChat,
  sendMessage,
  updateChatTitle,
} from "../controllers/chat.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";
import { chatRateLimiter } from "../middlewares/rateLimiter.middleware.js";
import { sendMessageValidator, createChatValidator } from "../validators/chat.validator.js";

const chatRouter = Router();

// All chat routes are protected
chatRouter.use(authUser);

/**
 * @route   GET /api/chats
 * @desc    Get all chats for logged-in user
 * @access  Private
 */
chatRouter.get("/", getUserChats);

/**
 * @route   POST /api/chats
 * @desc    Create a new chat
 * @access  Private
 */
chatRouter.post("/", createChatValidator, createChat);

/**
 * @route   GET /api/chats/:chatId
 * @desc    Get a single chat with messages
 * @access  Private
 */
chatRouter.get("/:chatId", getChatById);

/**
 * @route   PATCH /api/chats/:chatId
 * @desc    Update chat title
 * @access  Private
 */
chatRouter.patch("/:chatId", updateChatTitle);

/**
 * @route   DELETE /api/chats/:chatId
 * @desc    Delete a chat and its messages
 * @access  Private
 */
chatRouter.delete("/:chatId", deleteChat);

/**
 * @route   POST /api/chats/:chatId/messages
 * @desc    Send a message and receive AI response
 * @access  Private
 */
chatRouter.post("/:chatId/messages", chatRateLimiter, sendMessageValidator, sendMessage);

export default chatRouter;
