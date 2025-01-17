const User = require("../model/User");
const sendToken = require("../utils/jwtToken");
const { uploadSingle } = require("../utils/cloudinaryUploader");

exports.mobile = async (req, res) => {
  console.log(req.body);
  const firstName = req.body.given_name;
  const lastName = req.body.family_name;
  const email = req.body.email;
  const avatar = await uploadSingle(req.body.picture);
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
    const avatar = await uploadSingle(req.body.avatar);

    const body = { firstName, email, avatar };

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
    res.status(500).json({ message: "Internal Server Error" });
  }
};
