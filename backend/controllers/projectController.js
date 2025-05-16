const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");

// 🔹 Create a new project
exports.createProject = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized: No user ID found" });
    }

    const { title, description, tags, dueDate } = req.body;

    const project = await Project.create({
      title,
      description,
      tags,
      dueDate,
      createdBy: req.userId
    });

    await User.findByIdAndUpdate(req.userId, { $push: { projects: project._id } });

    res.status(201).json({ message: "Project created successfully!", project });
  } catch (error) {
    console.error("❌ Error creating project:", error.message);
    res.status(500).json({ message: "Error creating project", error: error.message });
  }
};

// 🔹 Get all projects for the logged-in user
exports.getProjects = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized: No user ID found" });
    }

    const projects = await Project.find({ createdBy: req.userId });
    res.status(200).json(projects);
  } catch (error) {
    console.error("❌ Error fetching projects:", error.message);
    res.status(500).json({ message: "Error fetching projects", error: error.message });
  }
};

// 🔹 Get a single project by ID
exports.getOnlyProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({ _id: id, createdBy: req.userId })
      .populate({
        path: "tasks",
        populate: {
          path: "subtasks",
        },
      });

    if (!project) {
      return res.status(404).json({ message: "Project not found or unauthorized!" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("❌ Error fetching project:", error.message);
    res.status(500).json({ message: "Error fetching project", error: error.message });
  }
};

// 🔹 Get full project details (FIXED & UPDATED)
exports.getFullProjectDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({ _id: id, createdBy: req.userId })
      .populate({
        path: "tasks",
        populate: {
          path: "subtasks"
        }
      });

    if (!project) {
      return res.status(404).json({ message: "Project not found or unauthorized!" });
    }

    let totalTasks = 0;
    let completedTasks = 0;

    const tasks = project.tasks.map(task => {
      totalTasks += 1;
      if (task.status === "completed") completedTasks += 1;

      const subtasks = task.subtasks.map(subtask => {
        totalTasks += 1;
        if (subtask.status === "completed") completedTasks += 1;
        return subtask;
      });

      return {
        ...task.toObject(),
        subtasks
      };
    });

    const completeness = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // 🔄 Update progress in DB
    project.progress = completeness;
    await project.save();

    res.status(200).json({
      project: {
        id: project._id,
        title: project.title,
        description: project.description,
        createdAt: project.createdAt,
        dueDate: project.dueDate,
        tags: project.tags,
        completeness,
        totalTasks,
        progress: completeness,
        tasks
      }
    });

  } catch (error) {
    console.error("❌ Error fetching full project details:", error.message);
    res.status(500).json({ message: "Failed to fetch full project details", error: error.message });
  }
};

// 🔹 Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findOneAndDelete({ _id: id, createdBy: req.userId });

    if (!project) {
      return res.status(404).json({ message: "Project not found or unauthorized!" });
    }

    res.json({ message: "Project deleted successfully!" });
  } catch (error) {
    console.error("❌ Error deleting project:", error.message);
    res.status(500).json({ message: "Failed to delete project!", error: error.message });
  }
};

// 🔹 Update a project (UPDATED)
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, progress } = req.body;

    const updateFields = { title, description };

    if (typeof progress === "number") {
      updateFields.progress = Math.min(100, Math.max(0, progress)); // Clamp between 0 and 100
    }

    const project = await Project.findOneAndUpdate(
      { _id: id, createdBy: req.userId },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found or unauthorized!" });
    }

    res.json({ message: "Project updated successfully!", project });
  } catch (error) {
    console.error("❌ Error updating project:", error.message);
    res.status(500).json({ message: "Failed to update project!", error: error.message });
  }
};
