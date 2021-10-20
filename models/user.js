var mongoose = require("mongoose");
const bcrypt = require("bcrypt");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: { type: String, minLength: 2, maxLength: 180 },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  date_created: { type: Date, required: true },
  registered: { type: Boolean, required: true },
  last_modified: { type: Date, required: true },
});

UserSchema.pre("save", async function (next) {
  const user = this;
	if (this.registered) {
  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;
	}
  next();
});

UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

// Virtual for url
UserSchema.virtual("url").get(function () {
  return "/blog/user/" + this._id;
});

module.exports = mongoose.model("User", UserSchema);
