const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  picture: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

announcementSchema.plugin(mongooseDelete, { overrideMethods: "all" });

module.exports = mongoose.model("Announcement", announcementSchema);
