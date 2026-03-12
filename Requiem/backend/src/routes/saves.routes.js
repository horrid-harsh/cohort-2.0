import { Router } from "express";
import {
  createSave,
  getAllSaves,
  getSaveById,
  updateSave,
  deleteSave,
} from "../controllers/saves.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All saves routes are protected
router.use(verifyJWT);

/**
 * @route /api/v1/saves
 * @methods GET - getAllSaves | POST - createSave
 * @access private
 */
router.route("/").get(getAllSaves).post(createSave);

/**
 * @route /api/v1/saves/:id
 * @methods GET - getSaveById | PATCH - updateSave | DELETE - deleteSave
 * @access private
 */
router.route("/:id").get(getSaveById).patch(updateSave).delete(deleteSave);

export default router;