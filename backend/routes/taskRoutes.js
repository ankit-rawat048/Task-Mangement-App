const express = require("express");
const { createTask } = require("../controllers/taskController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, createTask);

module.exports = router;
