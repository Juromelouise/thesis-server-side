const router = require("express").Router();
const upload = require("../utils/multer");

const { imageExtract } = require("../service/tesseract");
const { classifyReport } = require("../service/classifier");
const {
  createReport,
  updateReport,
  deleteReport,
  getAllDataAdmin,
  getSingleReport,
} = require("../controller/reportController");
const { isAuthenticated, Admin } = require("../middleware/auth");
const {
  createObstruction,
  updateObstruction,
  deleteObstruction,
  getAllobstructions,
  getSingleObstruction,
} = require("../controller/obstructionController");
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
// router.get("/fetch/all/reports", isAuthenticated, getAllData);
router.get("/fetch/all/reports", getAllData);
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
router.get("/admin/report", isAuthenticated, Admin, getAllDataAdmin);
router.get("/admin/obstruction",isAuthenticated, Admin, getAllobstructions);
router.get("/admin/report/:id",isAuthenticated, Admin, getSingleReport);
router.get("/admin/obstruction/:id",isAuthenticated, Admin, getSingleObstruction);

module.exports = router;
