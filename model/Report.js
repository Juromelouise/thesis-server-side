const mongoose = require("mongoose");
const populate = require("mongoose-autopopulate");

const reportSchema = new mongoose.Schema({
  plateNumber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PlateNumber",
    required: true,
    autopopulate: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

reportSchema.plugin(populate);

module.exports = mongoose.model("Report", reportSchema);
