import { body, validationResult } from "express-validator";

export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
    });
  }
  next();
}

export const sendMessageValidator = [
  body("content")
    .trim()
    .notEmpty().withMessage("Message content is required")
    .isLength({ min: 1, max: 10000 }).withMessage("Message must be between 1 and 10000 characters"),

  validate,
];

export const createChatValidator = [
  body("title")
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage("Title cannot exceed 100 characters"),

  validate,
];
