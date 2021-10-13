var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  content: { type: String, required: true },
  post: { type: Schema.Types.ObjectId, required: true },
  date_created: { type: Date, required: true },
  last_modified: { type: Date, required: true },
  anon: { type: Boolean, required: true }, // Does this person want this to be posted anonymously
});

// Virtual for url
CommentSchema.virtual("url").get(function () {
  return "/comments/" + this._id;
});

module.exports = mongoose.model("Comments", CommentSchema);
