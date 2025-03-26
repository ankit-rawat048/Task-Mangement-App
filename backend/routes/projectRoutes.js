const express = require("express");
const { createProject, getProjects, getOnlyProject, deleteProject, updateProject } = require("../controllers/projectController");
const auth = require("../middleware/auth");

const router = express.Router();

// ✅ Create a project
router.post("/", auth, createProject);

// ✅ Get all projects for the logged-in user
router.get("/", auth, getProjects);

// ✅ Get only one project for the logged-in user
router.get("/:id", auth, getOnlyProject);

// ✅ delete a project by id
router.delete("/:id", auth, deleteProject)

// ✅ update a project by id
router.put("/:id", auth, updateProject)

module.exports = router;
