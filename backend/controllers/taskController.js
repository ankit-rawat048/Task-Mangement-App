const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  const { name, project } = req.body;
  try {
    const task = new Task({ name, project });
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
