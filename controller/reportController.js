const Report = require("../model/Report");
const PlateNumber = require("../model/PlateNumber");
const { uploadMultiple } = require("../utils/cloudinaryUploader");

exports.createReport = async (req, res) => {
  try {
    console.log(req.body);
    let plate;
    const reporter = req.user.id;
    req.body.original = req.body.description.original;
    req.body.description = req.body.description.translation;
    const { location, description, original, plateNumber, violations } =
      req.body;
    const images = await uploadMultiple(req.files, "ReportImages");

    const report = await Report.create({
      location,
      description,
      images,
      original,
      reporter,
      plateNumber: null, // Initialize with null, will update later if plateNumber exists
    });

    if (plateNumber) {
      const ple = await PlateNumber.findOne({ plateNumber });
      if (ple) {
        plate = await PlateNumber.findByIdAndUpdate(
          ple._id,
          {
            count: ple.count + 1,
            $push: {
              violations: {
                report: report._id,
                types: violations,
              },
            },
          },
          { new: true }
        );
      } else {
        plate = await PlateNumber.create({
          plateNumber,
          violations: [
            {
              report: report._id,
              types: violations,
            },
          ],
        });
      }

      // Update the report with the plateNumber reference
      report.plateNumber = plate._id;
      await report.save();
    }

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
    let plate;
    req.body.original = req.body.description.original;
    req.body.description = req.body.description.translation;
    const { location, description, original, plateNumber, violations } =
      req.body;
    let images = [];
    if (req.files?.length > 0) {
      images = await uploadMultiple(req.files, "ReportImages");
    }

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (
      plateNumber &&
      report.plateNumber &&
      report.plateNumber.toString() !== plateNumber
    ) {
      await PlateNumber.findByIdAndUpdate(report.plateNumber, {
        $pull: { violations: { report: report._id } },
        $inc: { count: -1 },
      });
    }

    report.location = location;
    report.description = description;
    report.original = original;
    report.images = images;

    if (plateNumber) {
      const ple = await PlateNumber.findOne({ plateNumber });
      if (ple) {
        plate = await PlateNumber.findByIdAndUpdate(
          ple._id,
          {
            $push: {
              violations: {
                report: report._id,
                types: violations,
              },
            },
            $inc: { count: 1 },
          },
          { new: true }
        );
      } else {
        plate = await PlateNumber.create({
          plateNumber,
          violations: [
            {
              report: report._id,
              types: violations,
            },
          ],
        });
      }

      report.plateNumber = plate._id;
    }

    await report.save();

    res.status(201).json({ message: "Report is Updated", report });
  } catch (e) {
    console.log("Error in Updated Report:" + e);
    res.status(500).json({ message: "Error in updating report" });
  }
};

exports.deleteReport = async (req, res, next) => {
  try {
    console.log(req.params.id);
    const report = await Report.findById(req.params.id);
    await PlateNumber.findByIdAndUpdate(report.plateNumber, {
      $inc: { count: -1 },
    });
    if (report) {
      await report.remove();
    }
    res.status(200).json({ success: true });
  } catch (e) {
    console.log("Error in deleting report: " + e);
    res.status(500).json({ message: "Error in deleting report" });
  }
};

exports.getAllDataAdmin = async (req, res) => {
  try {
    const plateNumbers = await PlateNumber.find();
    const allViolations = plateNumbers.reduce((acc, plateNumber) => {
      return acc.concat(plateNumber.violations);
    }, []);
    // console.log(allViolations);
    res.status(200).json({ data: allViolations });
  } catch (e) {
    console.log("Error in fetching violations: " + e);
    res.status(500).json({ message: "Error in fetching violations" });
  }
};

exports.getSingleReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json({ report });
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ message: "Error in fetching report" });
  }
};

exports.updateReportStatus = async (req, res) => {
  try {
    console.log(req.body);
    let report;
    const editableStatus = await Report.findById(req.params.id);

    if (editableStatus.editableStatus < 3) {
      report = await Report.findByIdAndUpdate(
        req.params.id,
        {
          status: req.body.status,
          reason: req.body.reason,
          editableStatus: editableStatus.editableStatus + 1,
        },
        { new: true }
      );
    } else {
      return res
        .status(400)
        .json({ message: "Report status can be updated only three times" });
    }

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    console.log(report);

    res.status(200).json({ report });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// exports.editableStatus = async (req, res) => {
//   try {
//     const report = await Report.findByIdAndUpdate(
//       req.params.id,
//       { editableStatus: false },
//       { new: true }
//     );
//     if (!report) {
//       return res.status(404).json({ message: "Report not found" });
//     }
//     res.status(200).json({ report });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };
