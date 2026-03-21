import { Router } from "express";
import {
  createCollection,
  getAllCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
  addSaveToCollection,
  removeSaveFromCollection,
} from "../controllers/collections.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { apiLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

router.use(verifyJWT); // all routes protected


/**
 * @route /api/v1/collections
 * @methods GET - getAllCollections | POST - createCollection
 * @access private
 */
router.route("/").get(getAllCollections).post(apiLimiter, createCollection);

/**
 * @route /api/v1/collections/:id
 * @methods GET - getCollectionById | PATCH - updateCollection | DELETE - deleteCollection
 * @access private
 */
router.route("/:id").get(getCollectionById).patch(apiLimiter, updateCollection).delete(apiLimiter, deleteCollection);

/**
 * @route /api/v1/collections/:id/saves/:saveId
 * @methods PATCH - addSaveToCollection | DELETE - removeSaveFromCollection
 * @access private
 */
router.route("/:id/saves/:saveId").patch(apiLimiter, addSaveToCollection).delete(apiLimiter, removeSaveFromCollection);

export default router;