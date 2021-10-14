var Post = require("../models/post");
var { body, validationResult } = require("express-validator");

// Display all posts
// Need to have a striction to only list those that are publihedW:

exports.post_list = function (req, res, next) {
  Post.find({ published: true }, "title author date_created contents")
    .populate("author")
    .sort({ date_created: 1 })
    .exec(function (err, post_list) {
      if (err) {
        return next(err);
      }
      res.json({ post_list, msg: "all posts" });
    });
};

exports.post_create = [
  body("title", "Title must not be empty").trim().escape(),
  body("author", "Author must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("contents", "Contents of the post must not be empty").trim().escape(),
  body(
    "published",
    "You must specifiy if the post is to tbe pusblished or not"
  ).escape(),
  body("readable_url").trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const { title, author, contents, published } = req.body;

    const date = new Date();
    var post = new Post({
      title,
      author,
      contents,
      published,
      date_created: date,
      last_modified: date,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      res.json({
        new: post,
        data: req.body,
        errors: errors.array(),
      });
    } else {
      post.save(function (err) {
        if (err) {
          return next(err);
        }
        res.status(200).json({ msg: "post saved" });
      });
    }
  },
];

exports.post_get = async function (req, res, next) {
  const post = await Post.findById(req.params.postid);

  try {
    if (!post) {
      return res
        .status(404)
        .json({ err: `unable to get post (id: ${req.params.postid}),` });
    }
    return res.status(200).json({ post });
  } catch (err) {
    next(err);
  }
};

exports.post_update = [
  body("title", "Title must not be empty").trim().escape(),
  body("author", "Author must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body(
    "published",
    "You must specifiy if the post is to tbe pusblished or not"
  ).escape(),
  body("readable_url").trim().escape(),

  async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors.
      res.json({
        data: req.body,
        errors: errors.array(),
      });
    }

    const { title, author, contents } = req.body;

    var post = {
      title,
      author,
      contents,
      last_modified: new Date(),
    };

    Post.findByIdAndUpdate(req.params.postid, post, {}, function (err) {
      if (err) {
        return next(err);
      }
      res.status(200).json({ msg: "post updated" });
    });
  },
];

exports.post_delete = function (req, res, next) {
  Post.findByIdAndRemove(req.params.postid, {}, function (err) {
    if (err) {
      return next(err);
    } else {
      res.status(200).json({ msg: "post deleted" });
    }
  });
};
