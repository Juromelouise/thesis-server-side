const plateNumber = require("../model/PlateNumber");

exports.changeViolation = async (req, res) => {
  try {
    const { violations } = req.body;
    // const plate = await plateNumber.findByIdAndUpdate(
    //   req.params.id,
    //   { violations },
    //   { new: true }
    // );
    const plate = await plateNumber.findOneAndUpdate(
      { "violations.report": req.params.id },
      { $set: { "violations.$.types": violations } },
      { new: true }
    );
    res.status(200).json({ report: plate });
  } catch (error) {
    console.error("Error updating violations:", error);
    res.status(500).json({ message: "Failed to update violations." });
  }
};

exports.getAllPlateNumbers = async (req, res) => {
  try {
    const plateNumbers = await plateNumber.find({ count: { $gt: 0 } });
    res.status(200).json({ plateNumbers });
  } catch (error) {
    console.error("Error getting all plate numbers:", error);
    res.status(500).json({ message: "Failed to get all plate numbers." });
  }
};

exports.getPlateNumber = async (req, res) => {
  try {
    const data = await plateNumber.findById(req.params.id);
    res.status(200).json({ data });
  } catch (error) {
    console.error("Error getting plate number:", error);
    res.status(500).json({ message: "Failed to get plate number." });
  }
};
