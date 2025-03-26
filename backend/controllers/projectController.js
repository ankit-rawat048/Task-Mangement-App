const Project = require("../models/Project");
const User = require("../models/User");

exports.createProject = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.user.id;

        const project = new Project({ title, description, createdBy: userId });
        await project.save();

        await User.findByIdAndUpdate(userId, { $push: { projects: project._id } });

        res.status(201).json(project);
    } catch (error) {
        console.error("❌ Error creating project:", error);
        res.status(500).json({ message: "Error creating project", error });
    }
};

// ✅ Get all projects for the logged-in user
exports.getProjects = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("Fetching projects for user:", userId); // Debugging log

        const projects = await Project.find({ createdBy: userId });
        res.status(200).json(projects);
    } catch (error) {
        console.error("❌ Error fetching projects:", error);
        res.status(500).json({ message: "Error fetching projects", error });
    }
};

// get only one project for the logged in user 
exports.getOnlyProject = async (req, res) => {
    try {
        const userId = req.user.id;
        const projectId = req.params.id; // Get project ID from URL params

        console.log(`Fetching project ${projectId} for user: ${userId}`);

        const project = await Project.findOne({ _id: projectId, createdBy: userId }); // ✅ Find only one project

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json(project);
    } catch (error) {
        console.error("❌ Error fetching project:", error);
        res.status(500).json({ message: "Error fetching project", error });
    }
};

//detele a project using 
exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params; // Get project ID from URL params
        const userId = req.user.id; // Get logged-in user ID

        // Find the project and ensure it belongs to the user
        const project = await Project.findOneAndDelete({ _id: id, createdBy: userId });

        if (!project) {
            return res.status(404).json({ message: "Project not found or unauthorized!" });
        }

        res.json({ message: "Project deleted successfully!" });
    } catch (error) {
        console.error("❌ Error deleting project:", error);
        res.status(500).json({ message: "Failed to delete project!", error });
    }
};

//Update a project using 
exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params; // Get project ID from URL params
        const userId = req.user.id; // Get logged-in user ID
        const { title, description } = req.body; // Get new data from request body

        // Find the project and update it if it belongs to the user
        const project = await Project.findOneAndUpdate(
            { _id: id, createdBy: userId }, // Find by ID and user
            { $set: { title, description } }, // Update fields
            { new: true, runValidators: true } // Return updated project
        );

        if (!project) {
            return res.status(404).json({ message: "Project not found or unauthorized!" });
        }

        res.json({ message: "Project updated successfully!", project });
    } catch (error) {
        console.error("❌ Error updating project:", error);
        res.status(500).json({ message: "Failed to update project!", error });
    }
};