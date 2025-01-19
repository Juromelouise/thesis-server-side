const router = require("express").Router();

const {
  createAnnouncement,
  showAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controller/announcementController");
const { isAuthenticated, Admin } = require("../middleware/auth");

router.get("/show", showAnnouncement);
router.post("/create", isAuthenticated, createAnnouncement);

module.exports = router;
