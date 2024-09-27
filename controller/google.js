const passport = require("passport");
require("../googleAuth");
const User = require("../model/User");
const sendToken = require("../utils/jwtToken");

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

exports.protected = async (req, res) => {
  const firstName = req.user.given_name;
  const lastName = req.user.family_name;
  const email = req.user._json.email;
  const avatar = req.user._json.picture;

  const body = { firstName, lastName, email, avatar };

  try {
    // Check if the user exists in the database
    const loginUser = await User.findOne({ email });

    if (loginUser) {
      // If user exists, send token
      sendToken(loginUser, 200, res);
    } else {
      // If user does not exist, create a new user
      const newUser = await User.create(body);

      if (!newUser) {
        return res.status(500).json({
          status: false,
          message: "User not created",
        });
      }

      // Send token for newly created user
      sendToken(newUser, 200, res);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

exports.failure = (req, res) => {
  res.status(401);
};
