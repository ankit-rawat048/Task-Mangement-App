const Project = require("../models/Project");
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

// 🔹 Get a single project by ID (with populated tasks and subtasks)
exports.getOnlyProject = async (req, res) => {
    try {
      const { id } = req.params;
  
      const project = await Project.findOne({ _id: id, createdBy: req.userId })
        .populate({
          path: "tasks",
          populate: {
            path: "subtasks", // ✅ This works if Task schema has subtasks as ObjectId refs
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

// 🔹 Update a project
exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        const project = await Project.findOneAndUpdate(
            { _id: id, createdBy: req.userId },
            { $set: { title, description } },
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
