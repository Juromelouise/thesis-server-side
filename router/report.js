const router = require("express").Router();
const upload = require("../utils/multer");

const { imageExtract } = require("../service/tesseract");
const { classifyReport } = require("../service/classifier");
const { createReport } = require("../controller/reportController");

router.post("/extract/text", upload.single("imageReport"), imageExtract);
router.post("/post/report", upload.none(), classifyReport, createReport);

module.exports = router;
