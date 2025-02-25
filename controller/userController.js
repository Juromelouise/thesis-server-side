const User = require("../model/User");
const sendToken = require("../utils/jwtToken");
const { uploadSingle } = require("../utils/cloudinaryUploader");
const path = require("path");
const { URLSearchParams } = require("url");

exports.registerUser = async (req, res) => {
  try {
    let image;
    if (req.file) {
      image = await uploadSingle(req.file.path, "Avatar");
    } else {
      const defaultAvatarPath = path.join(
        __dirname,
        "../image/defaultavatar.jpg"
      );
      image = await uploadSingle(defaultAvatarPath, "Avatar");
    }
    req.body.avatar = image;
    const user = await User.create(req.body);
    console.log(user);
    sendToken(user, 200, res);
  } catch (e) {
    console.error("Error in Creating user: ", e);
    res.status(500).json({ message: "Error in Register User" });
  }
};
exports.loginUser = async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please enter email & password" });
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ error: "Invalid Email or Password" });
    }
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return res.status(401).json({ error: "Invalid Email or Password" });
    }
    console.log(user);
    sendToken(user, 200, res);
  } catch (error) {
    console.error("Error in Login User: ", error);
    res.status(500).json({ message: "Error in Login User" });
  }
};

exports.logout = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });

  console.log("logout");
};

exports.profile = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
};

// exports.updateProfile = async (req, res) => {

// };
