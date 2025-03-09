const Report = require("../model/Report");
const Obstruction = require("../model/Obstruction");
const { uploadMultiple } = require("../utils/cloudinaryUploader");

exports.getData = async (req, res) => {
  try {
    const reports = await Report.find({ reporter: req.user.id }).select("createdAt location description");
    const obstructions = await Obstruction.find({ reporter: req.user.id }).select("createdAt location description");

    const data = [...reports, ...obstructions].map(item => ({
      createdAt: item.createdAt,
      location: item.location,
      description: item.description,
      _id: item._id,
      plateNumber: item.plateNumber ? true : false
    }));
    console.log(data)
    // const data = [...reports, ...obstructions]
    // console.log(data)

    res.status(200).json({ data: data });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error on Fetching Report Data" });
  }
};

exports.getAllData = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const reports = await Report.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const obstructions = await Obstruction.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const data = [...reports, ...obstructions];
    res.status(200).json({ data: data });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Error on Fetching All Report Data" });
  }
};

exports.getAllDataApproved = async (req, res) => {
  try {
    const report = await Report.find({ status: "Approved" });
    const obstruction = await Obstruction.find({ status: "Approved" });
    const data = [...report, ...obstruction];
    res.status(200).json({ data: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error on Fetching All Approved Data" });
  }
};

exports.updateStatusResolved = async (req, res) => {
  try {
    const { status } = req.body;
    // console.log(req.params.id);

    const images = await uploadMultiple(req.files, "ConfirmationImages");
    let report = await Report.findByIdAndUpdate(
      req.params.id,
      { status, confirmationImages: images },
      { new: true }
    );
    if (!report) {
      report = await Obstruction.findByIdAndUpdate(
        req.params.id,
        { status, confirmationImages: images },
        { new: true }
      );
    }
    console.log(report);
    res.status(200).json({ message: "Status Updated to Resolved" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error on Updating Status to Resolved" });
  }
};
