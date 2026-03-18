import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import { generateAiResponse } from "../services/ai.service.js";
import { ApiError, ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// GET /api/chats — Get all chats for the logged-in user
export const getUserChats = asyncHandler(async (req, res) => {
  const chats = await chatModel
    .find({ user: req.user._id })
    .sort({ updatedAt: -1 })
    .select("_id title createdAt updatedAt");

  return ApiResponse.success(res, 200, "Chats fetched successfully", chats);
});

// POST /api/chats — Create a new chat
export const createChat = asyncHandler(async (req, res) => {
  const { title } = req.body;

  const chat = await chatModel.create({
    user: req.user._id,
    title: title || "New Chat",
  });

  return ApiResponse.success(res, 201, "Chat created successfully", chat);
});

// GET /api/chats/:chatId — Get a single chat with its messages
export const getChatById = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const chat = await chatModel.findOne({ _id: chatId, user: req.user._id });
  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  const messages = await messageModel
    .find({ chat: chatId })
    .sort({ createdAt: 1 })
    .select("_id content role sources createdAt");

  return ApiResponse.success(res, 200, "Chat fetched successfully", {
    chat,
    messages,
  });
});

// DELETE /api/chats/:chatId — Delete a chat and its messages
export const deleteChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const chat = await chatModel.findOne({ _id: chatId, user: req.user._id });
  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  await Promise.all([
    chatModel.findByIdAndDelete(chatId),
    messageModel.deleteMany({ chat: chatId }),
  ]);

  return ApiResponse.success(res, 200, "Chat deleted successfully");
});

// POST /api/chats/:chatId/messages — Send a message and get AI response
export const sendMessage = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { content } = req.body;

  if (!content?.trim()) {
    throw new ApiError(400, "Message content is required");
  }

  const chat = await chatModel.findOne({ _id: chatId, user: req.user._id });
  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  // Save user message
  const userMessage = await messageModel.create({
    chat: chatId,
    content: content.trim(),
    role: "user",
  });

  // Auto-update chat title from first message
  if (chat.title === "New Chat") {
    const titlePreview = content.trim().slice(0, 60);
    await chatModel.findByIdAndUpdate(chatId, {
      title: titlePreview.length < content.trim().length ? `${titlePreview}...` : titlePreview,
    });
  }

  // Fetch recent conversation history for context (last 10 messages)
  const history = await messageModel
    .find({ chat: chatId, _id: { $ne: userMessage._id } })
    .sort({ createdAt: -1 })
    .limit(10)
    .then((msgs) => msgs.reverse());

  // Generate AI response
  const { answer, sources } = await generateAiResponse(content, history);

  const aiMessage = await messageModel.create({
    chat: chatId,
    content: answer,
    role: "ai",
    sources,
  });

  return ApiResponse.success(res, 201, "Message sent successfully", {
    userMessage,
    aiMessage,
  });
});

// PATCH /api/chats/:chatId — Update chat title
export const updateChatTitle = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { title } = req.body;

  if (!title?.trim()) {
    throw new ApiError(400, "Title is required");
  }

  const chat = await chatModel.findOneAndUpdate(
    { _id: chatId, user: req.user._id },
    { title: title.trim() },
    { new: true, runValidators: true }
  );

  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  return ApiResponse.success(res, 200, "Chat title updated", chat);
});
