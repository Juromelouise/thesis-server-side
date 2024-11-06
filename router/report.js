const router = require("express").Router();
const upload = require("../utils/multer");

const { imageExtract } = require("../service/tesseract");
const { classifyReport } = require("../service/classifier");
const { createReport } = require("../controller/reportController");
const { isAuthenticated } = require("../middleware/auth");
const { createObstruction } = require("../controller/obstructionController");
//POST
router.post("/extract/text", upload.single("imageReport"), imageExtract);
router.post(
  "/post/report",
  upload.array("images"),
  isAuthenticated,
  classifyReport,
  createReport
);
router.post(
  "/post/obstruction",
  upload.array("images"),
  isAuthenticated,
  classifyReport,
  createObstruction
);

module.exports = router;
