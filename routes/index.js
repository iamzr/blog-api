var express = require("express");
var router = express.Router();

// Importing controllers
var postController = require("../controllers/postController");
var commentController = require("../controllers/commentController");
var userController = require("../controllers/userController");

router.get("/", function (req, res, next) {
  res.send("It works");
});
// POST ROUTES

// GET all posts
router.get("/posts", postController.post_list);

// Create new post
router.post("/posts", postController.post_create);

// GET post
router.get("/posts/:postid", postController.post_get);

// Update post
router.put("/posts/:postid", postController.post_update);

// Delete post
router.delete("/posts/:postid", postController.post_delete);

// COMMENTS routes

// Get comments for a post
router.get("/posts/:postid/comments", commentController.comment_list);

// Create a new comment for a post
router.post("/posts/:postid/comments", commentController.comment_create);

// Get specific comment
router.get("/posts/:postid/comments/:commentid", commentController.comment_get);

// Update specific comment
router.put(
  "/posts/:postid/comments/:commentid",
  commentController.comment_update
);

router.delete(
  "/posts/:postid/comments/:commentid",
  commentController.comment_delete
);

// USER routes

// User list
router.get("/users", userController.user_list);

router.post("/users", userController.user_create);

// Get specific user
router.get("/users/:userid", userController.user_get);

// Update user
router.put("/users/:userid", userController.user_update);

// Delete user
router.delete("/users/:userid", userController.user_delete);

module.exports = router;
