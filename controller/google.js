const User = require("../model/User");
const sendToken = require("../utils/jwtToken");
const { uploadSingle } = require("../utils/cloudinaryUploader");
const bcrypt = require("bcrypt");

exports.mobile = async (req, res) => {
  console.log(req.body);
  const firstName = req.body.given_name;
  const lastName = req.body.family_name;
  const email = req.body.email;
  const avatar = await uploadSingle(req.body.picture, "Avatar");
  // console.log(avatar)
  // const avatar = req.body.picture;

  const body = { firstName, lastName, email, avatar };

  try {
    // Check if the user exists in the database

    const loginUser = await User.findOne({ email });

    if (loginUser) {
      // If user exists, send token
      sendToken(loginUser, 200, res);
    } else {
      // If user does not exist, create a new user
      const randomPassword = Math.random().toString(36).slice(-8);
      console.log(randomPassword);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      body.password = hashedPassword;
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

exports.google = async (req, res, next) => {
  try {
    const firstName = req.body.name;
    const email = req.body.email;
    const avatar = await uploadSingle(req.body.avatar, "Avatar");

    const body = { firstName, email, avatar };

    const loginUser = await User.findOne({ email });

    if (loginUser) {
      // If user exists, send token
      sendToken(loginUser, 200, res);
    } else {
      // If user does not exist, create a new user
      // Generate a random password with a minimum length of 8 characters
      const randomPassword = Math.random().toString(36).slice(-8);
      console.log(randomPassword);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      body.password = hashedPassword;

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
    res.status(500).json({ message: "Internal Server Error" });
  }
};
