const Obstruction = require("../model/Obstruction");
const { uploadMultiple } = require("../utils/cloudinaryUploader");

exports.createObstruction = async (req, res) => {
  try {
    const reporter = req.user.id;
    const { location, description, violations } = req.body;
    const images = await uploadMultiple(req.files, "ObstructionImages");
    console.log(images);

    const obstruction = await Obstruction.create({
      location,
      description,
      images,
      reporter,
      violations,
    });

    res.status(200).json({
      obstruction,
    });
  } catch (e) {
    console.error("Error in creating obstruction:", e);
    res.status(500).json({ error: "Failed to create report" });
  }
};
