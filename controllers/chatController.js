const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const Chat_Group = require("../models/chat_group");
let _username = "";
const async = require('async')

exports.index = function (req, res, next) {
  async.parallel(
    {
      chat_group(callback) {
        Chat_Group.find({}).populate("image_id").exec(callback);
      },
      user_id(callback) {
        User.findOne({ username: "dummy" }, "_id").exec(callback);
      },
    },
    (err, result) => {
      if (err) {
        return next(err);
      }
      if (res.locals.currentUser) {
        _username = res.locals.currentUser.username;
      }
      res.render("chat-index", {
        title: _username,
        messages: result.chat_group,
        user: res.locals.currentUser,
        image:
          res.locals.currentUser == undefined ? result.user_id._id: res.locals.currentUser._id,
      });
    }
  );
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
    const { text, image } = req.body;

    if (res.locals.currentUser) {
      _username = res.locals.currentUser.username;
    }
    const chat_group = new Chat_Group({
      name: _username,
      date: new Date(),
      message: text,
      image_id: image,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      Chat_Group.find({}).exec(function (err, messages) {
        if (err) {
          return next(err);
        }
        res.render("chat-index", {
          title: _username,
          messages,
          errors: errors.array(),
          chat: chat_group.message,
        });
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
  res.redirect("/chat");
};
