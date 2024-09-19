const passport = require("passport");
require("../googleAuth");

exports.google = (req, res, next) => {
  passport.authenticate("google", { scope: ["email", "profile"] })(
    req,
    res,
    next
  );
};

exports.googleCallback = (req, res, next) => {
  passport.authenticate("google", {
    successRedirect: "/auth/protected",
    failureRedirect: "/auth/failure",
  })(req, res, next);
};

exports.protected = (req, res) => {
  res.send(req.user);
};

exports.failure = (req, res) => {
  res.send("something went wrong");
};
