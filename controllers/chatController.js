const { body, validationResult } = require("express-validator");
const Users = require("../models/user");
const Chat_Group = require("../models/chat_group");
let _username = "";


exports.index = function (req, res, next) {
  Chat_Group.find({}).exec(function (err, doc) {
    if (err) {
      return next(err);
    }
    res.render("chat-index", {
      title: _username,
      messages: doc,
    });
  });
};

exports.index_post = [
  body("text", "text space must be filled")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    const { text } = req.body;
    const chat_group = new Chat_Group({
      username: _username,
      date: new Date(),
      message: text,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("/chat", {
        title: _username,
        chat: chat_group,
        errors: errors.array(),
      });
      return;
    } else {
      //no error save
      chat_group.save((err) => {
        if (err) {
          return next(err);
        }
        // chat saved.
        res.redirect("/chat");
      });
    }
  },
];

exports.username_get = function (req, res, next) {
  res.render("chat-username", {});
};

exports.username_post = function (req, res, next) {
  const { username } = req.body;
  _username = username;
  console.log(_username);
  res.redirect("/chat");
};
