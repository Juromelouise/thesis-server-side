const router = require("express").Router();
const upload = require("../utils/multer");

const { imageExtract } = require("../service/tesseract");
const { classifyReport } = require("../service/classifier");
const {
  createReport,
  updateReport,
  deleteReport,
  getAllDataAdmin,
} = require("../controller/reportController");
const { isAuthenticated } = require("../middleware/auth");
const { createObstruction, updateObstruction, deleteObstruction, getAllobstructions } = require("../controller/obstructionController");
const { getData, getAllData } = require("../controller/obsrepController");
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
//GET
router.get("/fetch/all", isAuthenticated, getData);
router.get("/fetch/all/reports", isAuthenticated, getAllData);
//PUT
router.put(
  "/update/report/:id",
  upload.array("images"),
  isAuthenticated,
  classifyReport,
  updateReport
);
router.put(
  "/update/obstruction/:id",
  upload.array("images"),
  isAuthenticated,
  classifyReport,
  updateObstruction
);
//delete
router.delete("/delete/report/:id", isAuthenticated, deleteReport);
router.delete("/delete/obstruction/:id", isAuthenticated, deleteObstruction);

//ADMIN
router.get("/admin/report", getAllDataAdmin)
router.get("/admin/obstruction", getAllobstructions)

module.exports = router;
