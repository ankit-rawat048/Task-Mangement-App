const express = require("express");
const Task = require("../models/Task"); // ✅ Import Task model
const { createTask } = require("../controllers/taskController");
const auth = require("../middleware/auth");

const router = express.Router();

// ✅ Create Task
router.post("/", auth, createTask);

// ✅ Update Task Status
router.put("/:taskId", auth, async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Status is required!" });
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found!" });
        }

        task.status = status;
        await task.save();

        res.json({ message: "Task updated successfully", task });
    } catch (error) {
        res.status(500).json({ message: "Error updating task", error: error.message });
    }
});

// ✅ Delete Task
router.delete("/:taskId", auth, async (req, res) => {
    try {
        const { taskId } = req.params;

        // ✅ Check if the task exists
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found!" });
        }

        // ✅ Delete the task
        await Task.findByIdAndDelete(taskId);

        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting task", error: error.message });
    }
});

module.exports = router;
