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

exports.updateObstruction = async (req, res) => {
  try {
    // console.log(req.params.id);
    const { location, description, violations } = req.body;
    let images = [];
    if (req.files?.length > 0) {
      images = await uploadMultiple(req.files, "ObstructionImages");
    }
    const obstruction = await Obstruction.findByIdAndUpdate(
      req.params.id,
      { location, description, violations, images },
      {
        new: true,
        runValidators: true,
      }
    );
    console.log(obstruction);
    res
      .status(201)
      .json({ message: "Obstruction is Updated", obstruction: obstruction });
  } catch (e) {
    console.log("Error in Updated obstruction:" + e);
    res.status(500).json({ message: "Error in updating obstruction" });
  }
};

exports.deleteObstruction = async (req, res) => {
  try {
    console.log(req.params.id);
    await Obstruction.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (e) {
    console.log("Error in deleting obstruction: " + e);
    res.status(500).json({ message: "Error in deleting obstruction" });
  }
};

exports.getAllobstructions = async (req, res) => {
  try {
    const obstructions = await Obstruction.find();
    console.log(obstructions);
    res.status(200).json({ obstructions });
  } catch (e) {
    console.log("Error in getting all obstructions: " + e);
    res.status(500).json({ message: "Error in getting all obstructions" });
  }
};

exports.getSingleObstruction = async (req, res) => {
  try {
    const obstruction = await Obstruction.findById(req.params.id);
    res.status(200).json({ data: obstruction });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error on Fetching Obstruction Data" });
  }
};

