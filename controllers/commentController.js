var mongoose = require("mongoose");
var Comment = require("../models/comment");
var User = require("../models/user");
var { body, validationResult } = require("express-validator");

// Display all comments
// Need to have a striction to only list those that are publihedW:

exports.comment_list = function (req, res, next) {
  Comment.find({ post: req.params.postid }, "user content date_created anon")
    .sort({ date_created: 1 })
    .populate("user", "name")
    .lean()
    .exec(function (err, comment_list) {
      if (err) {
        return next(err);
      }

      //  comment_list.map((comment) => {
      //       temp = Object.assign({}, comment.toObject())
      //       console.log(temp)
      //     if (temp.anon) {
      //       temp.user = "Anon"
      //       console.log(temp.user)
      //       return temp
      //     }})
      for (const comment of comment_list) {
        if (comment.anon) {
          comment.user = "Anon";
          console.log(comment.user);
        } else {
          comment.user = comment.user.name;
        }
      }
      res.json({ comment_list, msg: "all comments" });
    });
};

exports.comment_create = [
  body("name", "Name must not be empty").trim().escape(),
  body("email", "Email must not be empty").trim().escape(),
  body("post", "Post must not be empty").trim().escape(),
  body("content", "Contents of the comment must not be empty").trim().escape(),
  body(
    "anon",
    "Need to specify if the user wants to be anonymous or not"
  ).escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    const { name, email, post, content, anon } = req.body;

    const date = new Date();

    if (!errors.isEmpty()) {
      // There are errors.
      res.json({
        data: req.body,
        errors: errors.array(),
      });
    } else {
      const user = await User.findOneAndUpdate(
        { email },
        {
          name,
          date_created: date,
          last_modified: date,
          registered: false,
        },
        {
          new: true,
          upsert: true,
        }
      );

      var comment = new Comment({
        user: user._id,
        post: mongoose.Types.ObjectId(post),
        content,
        anon: !!anon,
        date_created: date,
        last_modified: date,
      });
    }

    comment.save(function (err) {
      if (err) {
        next(err);
      }
      res.status(200).json({ msg: "comment saved" });
    });
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
