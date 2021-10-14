const express = require("express");
const router = express.Router();
const Post = require("../models/post");

router.get("/profile", (req, res, next) => {
  res.json({
    msg: "You made it to the secure route",
    user: req.user,
    token: req.token,
  });
});

router.get("/posts", function (req, res, next) {
  Post.find({ author: req.user }, "title author date_created contents")
    .populate("author")
    .sort({ date_created: 1 })
    .exec(function (err, post_list) {
      if (err) {
        return next(err);
      }
      res.json({ post_list, msg: "all posts" });
    });
});

module.exports = router;
