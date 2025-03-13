const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.log("❌ MongoDB Connection Failed:", err));

// Define Mongoose Schema (Tasks inside Projects)
const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  tasks: [
    {
      title: String,
      completed: Boolean
    }
  ]
});

// Define Project Model
const Project = mongoose.model("Project", projectSchema);

// 🚀 **Create a Project (Without Tasks Initially)**
app.post("/projects", async (req, res) => {
  const { name, description } = req.body;
  try {
    const project = new Project({ name, description, tasks: [] }); // Tasks array is empty initially
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🚀 **Get All Projects**
app.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🚀 **Add a Task to an Existing Project**
app.post("/projects/:projectId/tasks", async (req, res) => {
  const { title, completed } = req.body;
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    // Add task inside the project's tasks array
    project.tasks.push({ title, completed });
    await project.save();

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🚀 **Get All Tasks for a Specific Project**
app.get("/projects/:projectId/tasks", async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    res.json(project.tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

