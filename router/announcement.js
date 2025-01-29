const router = require("express").Router();

const {
  createAnnouncement,
  showAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  showAnnouncementById
} = require("../controller/announcementController");
const { isAuthenticated, Admin } = require("../middleware/auth");

router.get("/show", showAnnouncement);
router.get("/show/:id", showAnnouncementById);
router.post("/create", isAuthenticated, Admin, createAnnouncement);

module.exports = router;
