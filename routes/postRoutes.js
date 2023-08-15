const Router = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const postController = require('../controllers/postController');
const router = Router();

// POST create a post by current user
router.post("/posts/", authenticate, postController.createPost_post);

// GET post by post id 
router.get("/posts/:id", authenticate, postController.showPost_get);

// DELETE post by post id
router.delete("/posts/:id", authenticate, postController.deletePost_del);

// POST like a post by post id
router.post("/like/:id", authenticate, postController.likePost_post);

// POST unlike a post by post id
router.post("/unlike/:id", authenticate, postController.unlikePost_post);

// POST comment on post by post id
router.post("/comment/:id", authenticate, postController.commentPost_post)

// GET get all details of a post by post id
router.get("/all_posts", authenticate, postController.allPosts_get);

module.exports = router;