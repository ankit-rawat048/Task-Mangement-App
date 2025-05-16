const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Project = require("../models/Project");
const {
  createTask,
  updateTask,
  updateTaskNotes,
  deleteTask
} = require("../controllers/taskController");
const auth = require("../middleware/auth");

// 🔹 Create task or subtask under a specific project
router.post("/projects/:projectId/tasks", auth, async (req, res) => {
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
      parentTask,
      dependsOn
    } = req.body;

    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const task = new Task({
      title,
      description,
      deadline,
      status,
      priority,
      assignedTo,
      tags,
      notes,
      project: projectId,
      parentTask,
      dependsOn
    });

    await task.save();

    project.tasks.push(task._id);
    await project.save();

    if (parentTask) {
      const parent = await Task.findById(parentTask);
      if (parent) {
        parent.subtasks.push(task._id);
        await parent.save();
      }
    }

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
});

// 🔹 Get all top-level tasks only (not standalone subtasks)
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ parentTask: null }).populate("project subtasks");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
});

// 🔹 Get a single task by ID
router.get("/:taskId", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId).populate("project subtasks parentTask");

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error fetching task", error: error.message });
  }
});

// 🔹 Get all top-level tasks under a specific project
router.get("/projects/:projectId", auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      project: req.params.projectId,
      parentTask: null
    }).populate("subtasks");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks by project", error: error.message });
  }
});

// 🔹 Update full task (including reassignment, parent change, etc.)
router.put("/:taskId", auth, updateTask);

// 🔹 Delete task (and nested subtasks)
router.delete("/:taskId", auth, deleteTask);

// 🔹 Update notes only
router.put("/:id/notes", auth, updateTaskNotes);

module.exports = router;
