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

const router = Router();

router.use(verifyJWT);

/**
 * @route /api/v1/tags
 * @methods GET - getAllTags | POST - createTag
 * @access private
 */
router.route("/").get(getAllTags).post(createTag);

/**
 * @route /api/v1/tags/:id
 * @methods PATCH - updateTag | DELETE - deleteTag
 * @access private
 */
router.route("/:id").patch(updateTag).delete(deleteTag);

/**
 * @route /api/v1/tags/:id/saves/:saveId
 * @methods PATCH - addTagToSave | DELETE - removeTagFromSave
 * @access private
 */
router.route("/:id/saves/:saveId")
  .patch(addTagToSave)
  .delete(removeTagFromSave);

export default router;