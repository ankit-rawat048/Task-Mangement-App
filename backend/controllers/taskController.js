const Task = require("../models/Task");
const Project = require("../models/Project");

exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId, parentTaskId } = req.body;
    const task = new Task({ title, description, project: projectId });

    if (parentTaskId) {
      await Task.findByIdAndUpdate(parentTaskId, { $push: { subtasks: task._id } });
    } else {
      await Project.findByIdAndUpdate(projectId, { $push: { tasks: task._id } });
    }

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
};
