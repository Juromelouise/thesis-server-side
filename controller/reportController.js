const Report = require("../model/Report");
const PlateNumber = require("../model/PlateNumber");

exports.createReport = async (req, res) => {
  try {
    const { location, description, plateNumber, violations } = req.body;

    const plate = await PlateNumber.create({ plateNumber, violations });

    const report = await Report.create({
      location,
      description,
      plateNumber: plate._id,
    });

    res.status(200).json({
      report,
      plate,
    });
  } catch (e) {
    console.error("Error in creating report:", e);
    res.status(500).json({ error: "Failed to create report" });
  }
};
