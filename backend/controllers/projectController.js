const Project = require("../models/Project");

exports.createProject = async (req, res) => {
  const { name, description } = req.body;
  try {
    const project = new Project({ name, description, user: req.user.id });
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
