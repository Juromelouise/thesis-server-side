const Report = require("../model/Report");
const PlateNumber = require("../model/PlateNumber");
const { uploadMultiple } = require("../utils/cloudinaryUploader");

exports.createReport = async (req, res) => {
  try {
    const reporter = req.user.id;
    const { location, description, plateNumber, violations } = req.body;
    const images = await uploadMultiple(req.files, "ReportImages");
    // console.log(images);

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

exports.updateReport = async (req, res) => {
  try {
    console.log(req.params.id);
    const { location, description, plateNumber, violations } = req.body;
    let images = [];
    if (req.files?.length > 0) {
      images = await uploadMultiple(req.files, "ReportImages");
    }
    const plate = await PlateNumber.create({ plateNumber, violations });
    console.log(plate);

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { location, description, images, plateNumber: plate._id },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(201).json({ message: "Report is Updated", report: report });
  } catch (e) {
    console.log("Error in Updated Report:" + e);
    res.status(500).json({ message: "Error in updating report" });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    console.log(req.params.id);
    await Report.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (e) {
    console.log("Error in deleting report: " + e);
    res.status(500).json({ message: "Error in deleting report" });
  }
};
