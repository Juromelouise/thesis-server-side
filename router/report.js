const router = require("express").Router();
const upload = require("../utils/multer");

const { imageExtract } = require("../service/tesseract");
const { classifyReport } = require("../service/classifier");

router.post("/extract/text", upload.single("imageReport"), imageExtract);
router.post("/post/report",upload.none(), classifyReport);

module.exports = router;
