var User = require("../models/user");
var { body, validationResult } = require("express-validator");

// Display all users
// Need to have a striction to only list those that are publihed

exports.user_list = function (req, res, next) {
  User.find({}, "name email date_created registered")
    .sort({ date_created: 1 })
    .exec(function (err, user_list) {
      if (err) {
        return next(err);
      }
      res.json({ user_list, msg: "all users" });
    });
};

exports.user_create = [
  body("name", "Name must not be empty").trim().escape(),
  body("email", "Email must not be empty")
    .trim()
    .isEmail()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Password must not be empty").isLength({ min: 8 }).escape(),
  body(
    "registered",
    "Need to specify is this is a registered user or not. Unregistered would be someone just leaving a comment"
  ).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const { name, email, password, registered } = req.body;

    const date = new Date();
    var user = new User({
      name,
      email,
      password,
      registered: !!registered,
      date_created: date,
      last_modified: date,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      res.json({
        new: user,
        data: req.body,
        errors: errors.array(),
      });
    } else {
      user.save(function (err) {
        if (err) {
          return next(err);
        }
        res.status(200).json({ msg: "user saved" });
      });
    }
  },
];

exports.user_get = async function (req, res, next) {
  const user = await User.findById(req.params.userid);

  try {
    if (!user) {
      return res
        .status(404)
        .json({ err: `unable to get user (id: ${req.params.userid}),` });
    }
    return res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

exports.user_update = [
  body("name", "Name must not be empty").trim().escape(),
  body("email", "Email must not be empty")
    .trim()
    .isEmail()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Password must not be empty").isLength({ min: 8 }).escape(),
  body(
    "registered",
    "Need to specify is this is a registered user or not. Unregistered would be someone just leaving a comment"
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

    const { name, email, password, registered } = req.body;

    var user = {
      name,
      email,
      password,
      registered: !!registered,
      last_modified: new Date(),
    };

    User.findByIdAndUpdate(req.params.userid, user, {}, function (err) {
      if (err) {
        return next(err);
      }
      res.status(200).json({ msg: "user updated" });
    });
  },
];

exports.user_delete = function (req, res, next) {
  User.findByIdAndRemove(req.params.userid, {}, function (err) {
    if (err) {
      return next(err);
    } else {
      res.status(200).json({ msg: "user deleted" });
    }
  });
};
