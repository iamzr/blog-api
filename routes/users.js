var express = require("express");
var router = express.Router();
var passport = require("passport");
var jwt = require("jsonwebtoken");

var userController = require("../controllers/userController");

// USER ROUTES

// Signup
router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  async (req, res, next) => {
    res.json({
      msg: "Signup successful",
      user: req.user,
    });
  }
);

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error("An error occurred.");

        return next(error);
      }

      req.login(user, { session: false }, (error) => {
        if (error) return next(error);

        const body = { _id: user._id, email: user.email };
        const token = jwt.sign({ user: body }, process.env.SECRET);

        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

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
