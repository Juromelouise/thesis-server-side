const express = require("express");
const router = express.Router();

function isLoggin(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

const {
  google,
  googleCallback,
  failure,
  protected,
} = require("../controller/google");

router.get("/google", google);
router.get("/google/callback", googleCallback);
router.get("/protected", isLoggin, protected);
router.get("/failure", isLoggin, failure);

module.exports = router;