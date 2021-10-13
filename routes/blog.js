var express = require("express");
var router = express.Router();

// Importing Controllers
var postController = require("../controllers/postController");
var commentController = require("../controllers/commentController");

/* Posts routes */

// GET Homepage
router.get("/", postController.post_list);
