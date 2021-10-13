var Comment = require("../models/comment");
var { body, validationResult } = require("express-validator");

// Display all comments
// Need to have a striction to only list those that are publihedW:

exports.comment_list = function (req, res, next) {
  Comment.find({}, "user content post date_created anon")
    .sort({ date_created: 1 })
    .populate("user")
    .populate("post")
    .exec(function (err, comment_list) {
      if (err) {
        return next(err);
      }
      // comment_list.forEach((comment) => {
      //   if (comment.anon) {
      //     console.log("anoned");
      //     comment.user = "";
      //   }
      res.json({ comment_list, msg: "all comments" });
    });
};

exports.comment_create = [
  body("user", "User must not be empty").trim().escape(),
  body("post", "Post must not be empty").trim().escape(),
  body("content", "Contents of the comment must not be empty").trim().escape(),
  body(
    "anon",
    "Need to specify if the user wants to be anonymous or not"
  ).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const { user, post, content, anon } = req.body;

    const date = new Date();
    var comment = new Comment({
      user,
      post,
      content,
      anon: !!anon,
      date_created: date,
      last_modified: date,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      res.json({
        new: comment,
        data: req.body,
        errors: errors.array(),
      });
    } else {
      comment.save(function (err) {
        if (err) {
          return next(err);
        }
        res.status(200).json({ msg: "comment saved" });
      });
    }
  },
];

exports.comment_get = async function (req, res, next) {
  const comment = await Comment.findById(req.params.commentid);

  try {
    if (!comment) {
      return res
        .status(404)
        .json({ err: `unable to get comment (id: ${req.params.commentid}),` });
    }
    return res.status(200).json({ comment });
  } catch (err) {
    next(err);
  }
};

exports.comment_update = [
  body("content", "Contents of the comment must not be empty").trim().escape(),
  body(
    "anon",
    "Need to specify if the user wants to be anonymous or not"
  ).escape(),

  async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors.
      res.json({
        data: req.body,
        errors: errors.array(),
      });
    }

    const { content, anon } = req.body;

    var comment = {
      content,
      anon,
      last_modified: new Date(),
    };

    Comment.findByIdAndUpdate(
      req.params.commentid,
      comment,
      {},
      function (err) {
        if (err) {
          return next(err);
        }
        res.status(200).json({ msg: "comment updated" });
      }
    );
  },
];

exports.comment_delete = function (req, res, next) {
  Comment.findByIdAndRemove(req.params.commentid, {}, function (err) {
    if (err) {
      return next(err);
    } else {
      res.status(200).json({ msg: "comment deleted" });
    }
  });
};
