const router = require("express").Router();

const {
  registerUser,
  loginUser,
  logout,
} = require("../controller/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);

module.exports = router;
