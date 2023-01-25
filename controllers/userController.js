const { body, validationResult } = require("express-validator");
const Users = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.login_get = (req, res, next) => {
  res.render("sign-in-form");
};

exports.login_post = [
  passport.authenticate("local", {
    successRedirect: "/chat",
    failureRedirect: "/user/sign-up",
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

exports.sign_up_post = function (req, res, next) {
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(req.body.password, salt);
  // otherwise, store hashedPassword in DB
  const user = new User({
    username: req.body.username,
    password: hash,
  }).save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/user/log-in");
  });
};

exports.sign_up_get = (req, res) => res.render("sign-up-form");
