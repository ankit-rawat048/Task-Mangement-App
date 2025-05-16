const Task = require("../models/Task");
const Project = require("../models/Project");
const calculateProgress = require("../utils/calculateProgress");

// 🔁 Recursively delete all subtasks
const deleteSubtasksRecursively = async (taskId) => {
  const subtasks = await Task.find({ parentTask: taskId });
  for (const subtask of subtasks) {
    await deleteSubtasksRecursively(subtask._id);
    await Task.findByIdAndDelete(subtask._id);
  }
};

// 🔹 Create Task (with optional parent or project)
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      deadline,
      status,
      priority,
      assignedTo,
      tags,
      notes,
      project,
      parentTask,
      dependsOn
    } = req.body;

    const task = new Task({
      title,
      description,
      deadline,
      status,
      priority,
      assignedTo,
      tags,
      notes,
      project,
      parentTask,
      dependsOn
    });

    await task.save();

    // Handle parent task linkage
    if (parentTask) {
      await Task.findByIdAndUpdate(parentTask, { $push: { subtasks: task._id } });
    } else if (project) {
      await Project.findByIdAndUpdate(project, { $push: { tasks: task._id } });
    }

    // 🔄 Recalculate project progress
    if (project) {
      const proj = await Project.findById(project).populate({
        path: "tasks",
        populate: { path: "subtasks" }
      });

      const progress = calculateProgress(proj.tasks);
      proj.progress = progress;
      await proj.save();
    }

    res.status(201).json({ message: "Task created successfully!", task });
  } catch (error) {
    console.error("❌ Error creating task:", error.message);
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
};

// 🔹 Update Task
const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updateData = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Handle parentTask change
    if (
      updateData.parentTask !== undefined &&
      updateData.parentTask !== task.parentTask?.toString()
    ) {
      if (task.parentTask) {
        await Task.findByIdAndUpdate(task.parentTask, {
          $pull: { subtasks: task._id }
        });
      }
      if (updateData.parentTask) {
        await Task.findByIdAndUpdate(updateData.parentTask, {
          $push: { subtasks: task._id }
        });
      }
      task.parentTask = updateData.parentTask;
    }

    // Apply other updates
    Object.assign(task, updateData);
    await task.save();

    // 🔄 Recalculate project progress
    const project = await Project.findById(task.project).populate({
      path: "tasks",
      populate: { path: "subtasks" }
    });

    const progress = calculateProgress(project.tasks);
    project.progress = progress;
    await project.save();

    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error("❌ Error updating task:", error.message);
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
};

// 🔹 Update Only Notes
const updateTaskNotes = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.notes = req.body.notes || "";
    await task.save();

    res.json({ message: "Notes updated successfully", notes: task.notes });
  } catch (error) {
    res.status(500).json({ message: "Error updating notes", error: error.message });
  }
};

// 🔹 Delete Task (and nested subtasks) and update project
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Remove from project or parent task
    if (task.project) {
      await Project.findByIdAndUpdate(task.project, {
        $pull: { tasks: task._id }
      });
    }

    if (task.parentTask) {
      await Task.findByIdAndUpdate(task.parentTask, {
        $pull: { subtasks: task._id }
      });
    }

    // Delete all nested subtasks
    await deleteSubtasksRecursively(task._id);
    await Task.findByIdAndDelete(task._id);

    // 🔄 Recalculate project progress
    if (task.project) {
      const project = await Project.findById(task.project).populate({
        path: "tasks",
        populate: { path: "subtasks" }
      });

      const progress = calculateProgress(project.tasks);
      project.progress = progress;
      await project.save();
    }

    res.json({ message: "Task and all nested subtasks deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting task:", error.message);
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
};

module.exports = {
  createTask,
  updateTask,
  updateTaskNotes,
  deleteTask
};
