const router = require("express").Router();
const upload = require("../utils/multer");

const { imageExtract } = require("../service/tesseract");

router.post("/post", upload.single("imageReport"), imageExtract);

module.exports = router;
