const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const Schema = mongoose.Schema;

const Chat_groupSchema = new Schema({
  name: { type: String, required: true, unique: false },
  date: { type: Date },
  message: { type: String, required: true, minLength: 1 },
  image_id: { type: Schema.Types.ObjectId, ref: "Users", required: true, },
});

Chat_groupSchema.virtual("formatted_date").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});

Chat_groupSchema.virtual("id").get(function () {
  return this._id;
});

module.exports = mongoose.model("Chat_Group", Chat_groupSchema);
