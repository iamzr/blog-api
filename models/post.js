var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: { type: String, required: true, minLength: 2, maxLength: 180 },
  contents: { type: String },
  author: { type: Schema.Types.ObjectId, required: true }, // Need to convert back to objectid
  date_created: { type: Date, required: true },
  last_modified: { type: Date, required: true },
  published: { type: Boolean, required: true },
  readable_url: { type: String, minlength: 3, maxLength: 180 },
});

// Virtual for url
PostSchema.virtual("permalink").get(function () {
  return "/blog/post/" + this._id;
});

PostSchema.virtual("url").get(function () {
  return "/blog/post/" + this.readable_url;
});

module.exports = mongoose.model("Post", PostSchema);
