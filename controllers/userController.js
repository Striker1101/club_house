const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { uploadToCloudinary, removeFromCloudinary } = require("./cloudinary");

exports.login_get = (req, res, next) => {
  res.render("sign-in-form", {
    error: req.session.messages,
  });
};

exports.login_post = [
  passport.authenticate("local", {
    successRedirect: "/chat",
    failureRedirect: "/users/log-in",
    failureMessage: true,
  }),
];

exports.logout_get = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.sign_up_post = [
  body("username", "username must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "password must be more than 4 words")
    .isLength({ min: 4 })
    .escape(),

  async function (req, res, next) {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(req.body.password, salt);
    // otherwise, store hashedPassword in DB
    const data = await uploadToCloudinary(req.file.path, "club_house");

    const user = new User({
      email: req.body.email,
      username: req.body.username,
      password: hash,
      imageUrl: data.url,
      publicId: data.public_id,
    });
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("sign-up-form", {
        errors: errors.array(),
        user: user,
      });
      return;
    }
    //sucess
    user.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/users/log-in");
    });
  },
];

exports.sign_up_get = (req, res) =>
  res.render("sign-up-form", {
    errors: [],
  });
