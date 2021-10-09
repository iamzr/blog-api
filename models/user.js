var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: { type: String, required: true, minLength: 2, maxLength: 180 },
  email: { type: String, required: true },
  password: { required: true },
  date_created: { type: Date },
});

// Virtual for url
UserSchema.virtual("url").get(function () {
  return "/blog/user/" + this._id;
});

module.exports = mongoose.model("User", UserSchema);
