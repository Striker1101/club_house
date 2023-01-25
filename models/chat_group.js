const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const Schema = mongoose.Schema;

const Chat_groupSchema = new Schema({
  username: { type: String, required: true, unique: true },
  date: { type: Date },
  message: { type: String, required: true, minLength: 1 },
});

Chat_groupSchema.virtual("formatted_date").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});

Chat_groupSchema.virtual("id").get(function () {
  return this._id;
});

module.exports = mongoose.model("Chat_Group", Chat_groupSchema);
