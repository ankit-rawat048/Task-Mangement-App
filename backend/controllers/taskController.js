const Task = require("../models/Task");
const Project = require("../models/Project");

exports.createTask = async (req, res) => {
  try {
    const { title, description, deadline, status, projectId, parentTaskId } = req.body;

    const task = new Task({
      title,
      description,
      deadline,
      status,
      project: projectId
    });

    await task.save(); // Save task first to get task._id

    if (parentTaskId) {
      await Task.findByIdAndUpdate(parentTaskId, { $push: { subtasks: task._id } });
    } else if (projectId) {
      await Project.findByIdAndUpdate(projectId, { $push: { tasks: task._id } });
    }

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
};
