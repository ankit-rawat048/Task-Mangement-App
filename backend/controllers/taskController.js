const Task = require("../models/Task");
const Project = require("../models/Project");

// 🔹 Create Task (with notes support)
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      deadline,
      status,
      projectId,
      parentTaskId,
      priority,
      assignedTo,
      tags,
      notes
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Task title is required" });
    }

    // Create new Task
    const task = new Task({
      title,
      description,
      deadline,
      status,
      project: projectId || null,
      priority,
      assignedTo,
      tags,
      notes
    });

    await task.save(); // Save task

    // Handle Subtasks
    if (parentTaskId) {
      const parentTask = await Task.findById(parentTaskId);
      if (!parentTask) {
        return res.status(404).json({ message: "Parent task not found" });
      }
      parentTask.subtasks.push(task._id);
      await parentTask.save();
    }

    // Handle linking to Project (if projectId given)
    if (projectId) {
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      project.tasks.push(task._id);
      await project.save();
    }

    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error); // Better debug
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
};

// 🔹 Update Notes for a Task
exports.updateTaskNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { notes },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Notes updated successfully!", task: updatedTask });
  } catch (error) {
    console.error("Failed to update notes:", error);
    res.status(500).json({ message: "Failed to update notes", error: error.message });
  }
};
