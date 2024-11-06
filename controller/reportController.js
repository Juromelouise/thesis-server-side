const Report = require("../model/Report");
const PlateNumber = require("../model/PlateNumber");
const { uploadMultiple } = require("../utils/cloudinaryUploader");

exports.createReport = async (req, res) => {
  try {
    const reporter = req.user.id;
    const { location, description, plateNumber, violations } = req.body;
    const images = await uploadMultiple(req.files, "ReportImages");
    console.log(images);

    const plate = await PlateNumber.create({ plateNumber, violations });

    const report = await Report.create({
      location,
      description,
      images,
      reporter,
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
