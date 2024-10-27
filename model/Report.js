const mongoose = require("mongoose");
const populate = require("mongoose-autopopulate");

const reportSchema = new mongoose.Schema({
  plateNumber: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

reportSchema.plugin(populate);

module.exports = mongoose.model("Report", reportSchema);
