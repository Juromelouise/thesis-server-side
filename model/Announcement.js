const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
  },
});

module.exports = mongoose.model("Announcement", announcementSchema);
