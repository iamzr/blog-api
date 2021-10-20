var express = require("express");
var router = express.Router();
var passport = require("passport");

// Controller
var postController = require("../controllers/postController");

// POST ROUTES

// GET all posts
router.get("/posts", postController.post_list);

// Create new post
router.post(
  "/posts",
  // passport.authenticate("jwt", { session: false }),
  postController.post_create
);

// GET post
router.get("/posts/:postid", postController.post_get);

// Update post
router.put("/posts/:postid", postController.post_update);

// Delete post
router.delete("/posts/:postid", postController.post_delete);

module.exports = router;
