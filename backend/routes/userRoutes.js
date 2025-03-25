const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth"); // Ensures JWT is verified

const router = express.Router();

// Fetch User Data with Projects and Tasks
router.get("/user", authMiddleware, async (req, res) => {
    try {
        console.log(" Extracted User ID:", req.userId); // Debugging log

        const user = await User.findById(req.userId)
            .populate("projects") // Populate projects
            .populate({
                path: "projects",
                populate: { path: "tasks" } // Populate tasks inside projects
            });

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user data", error: error.message });
    }
});

module.exports = router;
