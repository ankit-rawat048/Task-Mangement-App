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
