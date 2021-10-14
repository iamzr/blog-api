var express = require("express");
var router = express.Router();

var commentController = require("../controllers/commentController");

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

module.exports = router;
