import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadFile, deleteFile } from "../controllers/upload.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

/**
 * @description Upload single file
 * @route POST /api/v1/upload
 * @access private
 */
router.post("/", verifyJWT, upload.single("file"), uploadFile);

/**
 * @description Delete file
 * @route DELETE /api/v1/upload
 * @access private
 */
router.delete("/", verifyJWT, deleteFile);

export default router;
