const express = require('express');
const postRouter = express.Router();
const postController = require('../controllers/post.controller');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })
const authUser = require('../middlewares/auth.middleware');

/**
 * POST /api/posts [protected]
 */
postRouter.post('/', authUser, upload.single("image"), postController.createPostController); // (upload.single("image")) Extracts the uploaded file from the "image" field and attaches it to req.file


/**
 * GET /api/posts [protected]
 */
postRouter.get('/', authUser, postController.getPostController);

/**
 * GET /api/posts/details/:postid
 */
postRouter.get('/details/:postId', authUser, postController.getPostDetailsController)

module.exports = postRouter;