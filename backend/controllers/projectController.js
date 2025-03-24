const Project = require("../models/Project");
const User = require("../models/User");

exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    const project = new Project({ title, description, createdBy: userId });
    await project.save();

    await User.findByIdAndUpdate(userId, { $push: { projects: project._id } });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Error creating project", error });
  }
};
