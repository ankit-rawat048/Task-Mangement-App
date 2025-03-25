const express = require("express");
const { createProject, getProjects } = require("../controllers/projectController");
const auth = require("../middleware/auth");

const router = express.Router();

// ✅ Create a project
router.post("/", auth, createProject);

// ✅ Get all projects for the logged-in user
router.get("/", auth, getProjects);

module.exports = router;
