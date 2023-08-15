const Router = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const userController = require("../controllers/userController")
const router = Router();

// GET Current User Profile
router.get("/user", authenticate, userController.currentUser_get);

// POST Follow a User
router.post("/follow/:id", authenticate, userController.followUser_post);

// POST Un-follow a User
router.post("/unfollow/:id", authenticate, userController.unfollowUser_post);

module.exports = router;