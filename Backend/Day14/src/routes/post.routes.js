const express = require('express');
const postRouter = express.Router();
const postController = require('../controllers/post.controller');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })
const authUser = require('../middlewares/auth.middleware');

/**
 * Handles post creation
 * @route POST /api/posts
 * @access Private
 */
postRouter.post('/', authUser, upload.single("image"), postController.createPostController); // (upload.single("image")) Extracts the uploaded file from the "image" field and attaches it to req.file

/**
 * Handles post fetching
 * @route GET /api/posts
 * @access Private
 */
postRouter.get('/', authUser, postController.getPostController);

/**
 * Handles post details fetching
 * @route GET /api/posts/details/:postid
 * @access Private
 */
postRouter.get('/details/:postId', authUser, postController.getPostDetailsController);

module.exports = postRouter;