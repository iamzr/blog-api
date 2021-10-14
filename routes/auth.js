const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");

// POST login

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

router.post("/login", async (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        msg: "Something is not right",
        user,
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
    });

    // Generate a signed json web token with the contents of user object and return
    const token = jwt.sign(user, "your_jwft_secret");
    return res.json({ user, token });
  });
});

module.exports = router;
