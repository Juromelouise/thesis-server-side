const Report = require("../model/Report");
const Obstruction = require("../model/Obstruction");

exports.getData = async (req, res) => {
  try {
    const reports = await Report.find({ reporter: req.user.id });
    const obstructions = await Obstruction.find({ reporter: req.user.id });

    const data = [...reports, ...obstructions];

    res.status(200).json({ data: data });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error on Fetching Report Data" });
  }
};

exports.getAllData = async (req, res) => {
  try {
    const reports = await Report.find();
    const obstructions = await Obstruction.find();

    const data = [...reports, ...obstructions];
    res.status(200).json({ data: data });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Error on Fetching All Report Data" });
  }
};