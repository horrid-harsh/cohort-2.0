import { Router } from "express";
import { uploadAvatar, deleteAvatar } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

/**
 * @route /api/v1/users/avatar
 * @methods PATCH - uploadAvatar
 * @access private
 */
router.patch("/avatar", verifyJWT, upload.single("avatar"), uploadAvatar);

/**
 * @route /api/v1/users/avatar
 * @methods DELETE - deleteAvatar
 * @access private
 */
router.delete("/avatar", verifyJWT, deleteAvatar);

export default router;
