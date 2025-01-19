const Announcement = require("../model/Announcement");

exports.createAnnouncement = async (req, res) => {
  try {
    const { title, description } = req.body;
    const announcement = new Announcement({
      title,
      description,
    });
    const data = await announcement.save();
    console.log(data);
    res.status(200).json({ message: "Announcement created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    await Announcement.findByIdAndDelete(id);
    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error) {}
};

exports.updateAnnouncement = async (req, res) => {
  try {
  } catch (error) {}
};

exports.showAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.find();
    console.log(announcement);
    res.status(200).json({ announcement });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
