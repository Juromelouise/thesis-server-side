const plateNumber = require("../model/PlateNumber");

exports.changeViolation = async (req, res) => {
  try {
    const { violations } = req.body;
    const plate = await plateNumber.findByIdAndUpdate(
      req.params.id,
      { violations },
      { new: true }
    );
    res.status(200).json({ report: plate });
  } catch (error) {
    console.error("Error updating violations:", error);
    res.status(500).json({ message: "Failed to update violations." });
  }
};
