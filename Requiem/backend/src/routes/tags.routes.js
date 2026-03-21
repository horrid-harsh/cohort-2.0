import { Router } from "express";
import {
  createTag,
  getAllTags,
  updateTag,
  deleteTag,
  addTagToSave,
  removeTagFromSave,
} from "../controllers/tags.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { apiLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

router.use(verifyJWT);

/**
 * @route /api/v1/tags
 * @methods GET - getAllTags | POST - createTag
 * @access private
 */
router.route("/").get(getAllTags).post(apiLimiter, createTag);

/**
 * @route /api/v1/tags/:id
 * @methods PATCH - updateTag | DELETE - deleteTag
 * @access private
 */
router.route("/:id").patch(apiLimiter, updateTag).delete(apiLimiter, deleteTag);

/**
 * @route /api/v1/tags/:id/saves/:saveId
 * @methods PATCH - addTagToSave | DELETE - removeTagFromSave
 * @access private
 */
router.route("/:id/saves/:saveId")
  .patch(apiLimiter, addTagToSave)
  .delete(apiLimiter, removeTagFromSave);

export default router;