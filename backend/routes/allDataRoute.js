const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");

router.get("/all-data", async (req, res) => {
  try {
    const recentProjects = await Project.find().sort({ createdAt: -1 }).limit(5);
    const completedTasks = await Task.find({ status: "completed" }).sort({ updatedAt: -1 }).limit(5);

    res.json({
      recentProjects,
      completedTasks,
    });
  } catch (error) {
    console.error("Error fetching all data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
