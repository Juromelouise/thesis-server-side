const mongoose = require("mongoose");

const plateNumberSchema = new mongoose.Schema({
  plateNumber: {
    type: String,
    required: true,
    trim: true,
  },
  violations: [
    {
      type: String,
      trim: true,
      required: true,
    },
  ],
  count:{
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PlateNumber", plateNumberSchema);
