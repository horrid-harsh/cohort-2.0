import { Router } from "express";
import {
  createSave,
  getAllSaves,
  getSaveById,
  getRelatedSaves,
  updateSave,
  deleteSave,
} from "../controllers/saves.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { apiLimiter, aiLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

// All saves routes are protected
router.use(verifyJWT);

/**
 * @route /api/v1/saves
 * @methods GET - getAllSaves | POST - createSave
 * @access private
 */
router.route("/").get(getAllSaves).post(aiLimiter, createSave);

/**
 * @route /api/v1/saves/:id
 * @methods GET - getSaveById | PATCH - updateSave | DELETE - deleteSave
 * @access private
 */
router.route("/:id").get(getSaveById).patch(apiLimiter, updateSave).delete(apiLimiter, deleteSave);

/**
 * @route /api/v1/saves/:id/related
 * @methods GET - getRelatedSaves
 * @access private
 */
router.get("/:id/related", getRelatedSaves);


export default router;
