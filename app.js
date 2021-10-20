var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var passport = require("passport");
var cors = require("cors");
require("dotenv").config();
require("./passport");

// Routers
var indexRouter = require("./routes/index");
var postsRouter = require("./routes/posts");
var commentsRouter = require("./routes/comments");
var usersRouter = require("./routes/users");
var secureRouter = require("./routes/secure-routes");
var compression = require("compression");
var helmet = require("helmet");
var app = express();

// Set up mongoose connection
var mongoose = require("mongoose");
var mongoDB = process.env.DB;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));

// Set up cors
app.use(cors());

// Compress all routers
app.use(compression());

app.use(helmet());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());

app.use("/", indexRouter);
app.use("/", postsRouter);
app.use("/", commentsRouter);
app.use("/", usersRouter);
app.use("/", passport.authenticate("jwt", { session: false }), secureRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  const message = err.message;
  const error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ msg: message, status: error.status, stack: error.stack });
});

module.exports = app;
