const Report = require("../model/Report");
const PlateNumber = require("../model/PlateNumber");
const axios = require("axios");
const { uploadMultiple } = require("../utils/cloudinaryUploader");
const FormData = require("form-data");
const fs = require("fs").promises;
const path = require("path");

const ensureTempDirectoryExists = async () => {
  const tempDir = path.join(__dirname, "../temp");
  try {
    await fs.mkdir(tempDir, { recursive: true });
  } catch (err) {
    console.error("Error creating temp directory:", err);
  }
};

const blurImages = async (files) => {
  const blurredImages = [];

  await ensureTempDirectoryExists();

  for (const file of files) {
    const formData = new FormData();
    const fileBuffer = await fs.readFile(file.path);
    formData.append("file", fileBuffer, file.originalname);

    const response = await axios.post(
      `${process.env.CURL_API}/blur/images`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
        responseType: "arraybuffer",
      }
    );

    const blurredImage = Buffer.from(response.data, "binary");
    const blurredImagePath = path.join(__dirname, "../temp", file.originalname);
    await fs.writeFile(blurredImagePath, blurredImage);
    blurredImages.push({
      path: blurredImagePath,
      originalname: file.originalname,
    });
  }

  return blurredImages;
};

exports.createReport = async (req, res) => {
  try {
    // console.log(req.files);
    console.log(req.body);
    let plate;
    const reporter = req.user.id;
    req.body.original = req.body.description.original;
    req.body.description = req.body.description.translation;
    const { location, description, original, plateNumber, violations, postIt } =
      req.body;

    // Blur images
    const blurredImages = await blurImages(req.files);

    const images = await uploadMultiple(blurredImages, "ReportImages/Blurred");
    const imagesAdmin = await uploadMultiple(req.files, "ReportImages");

    const report = await Report.create({
      location,
      description,
      images,
      imagesAdmin,
      original,
      reporter,
      postIt,
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
    const { location, description, original, plateNumber, violations, postIt } =
      req.body;

    // Blur images if there are new files
    let images = [];
    let imagesAdmin = [];
    if (req.files?.length > 0) {
      const blurredImages = await blurImages(req.files);
      images = await uploadMultiple(blurredImages, "ReportImages");
      imagesAdmin = await uploadMultiple(req.files, "ReportImages");
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
    report.imagesAdmin = imagesAdmin;
    report.postIt = postIt;

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
  console.log(req.query);
  try {
    const { page = 1, limit = 10 } = req.query; // Get page and limit from query, default to page 1 and limit 10

    const plateNumbers = await PlateNumber.find()
      .populate({
        path: "violations.report",
        select: "location description createdAt",
      })
      .select("plateNumber violations createdAt");

    const allViolations = plateNumbers.flatMap((plateNumber) =>
      plateNumber.violations.map((violation) => ({
        plateNumber: plateNumber.plateNumber,
        location: violation.report.location,
        description: violation.report.description,
        createdAt: violation.report.createdAt,
        types: violation.types,
        status: violation.report.status,
        _id: violation.report._id,
      }))
    );

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedViolations = allViolations.slice(startIndex, endIndex);

    res.status(200).json({
      data: paginatedViolations,
      totalItems: allViolations.length,
      totalPages: Math.ceil(allViolations.length / limit),
      currentPage: parseInt(page),
    });
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

    const violationTypes = report.plateNumber.violations
      .filter((violation) => violation.report._id.toString() === req.params.id)
      .map((violation) => violation.types);

    const reportData = {
      ...report.toObject(),
      plateNumber: {
        ...report.plateNumber.toObject(),
        violations: violationTypes,
      },
    };

    res.status(200).json({ report: reportData });
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ message: "Error in fetching report" });
  }
};

exports.updateReportStatus = async (req, res, next) => {
  try {
    let report;
    const editableStatus = await Report.findById(req.params.id);

    if (editableStatus.editableStatus < 3) {
      report = await Report.findByIdAndUpdate(
        req.params.id,
        {
          status: req.body.status,
          reason: req.body.reason,
          // editableStatus: editableStatus.editableStatus + 1,
        },
        { new: true }
      );
      if (editableStatus.editableStatus === 0) {
        const plate = await PlateNumber.findByIdAndUpdate(
          report.plateNumber._id.toString(),
          {
            $inc: { offense: 1 },
          },
          { new: true }
        );
        console.log(plate);
      }
    } else {
      return res
        .status(400)
        .json({ message: "Report status can be updated only three times" });
    }

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    req.report = report;
    // next();
    // res.status(200).json({ report });
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
