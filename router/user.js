const router = require("express").Router();

const {
  registerUser,
  loginUser,
  logout,
  profile,
} = require("../controller/userController");

const { isAuthenticated } = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/profile", isAuthenticated, profile);

module.exports = router;
