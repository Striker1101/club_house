const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UsersSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
UsersSchema.virtual("id").get(function () {
  return `${this._id}`;
});

module.exports = mongoose.model("Users", UsersSchema);
