var express = require("express");

var router = express.Router();

// Importing controllers

router.get("/", function (req, res, next) {
  res.send("It works");
});

module.exports = router;
