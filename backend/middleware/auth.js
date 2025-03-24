const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access Denied! No Token Provided" });
    }

    try {
        // Extract token
        const token = authHeader.split(" ")[1].trim();
        console.log("🔍 Extracted Token:", token); // Debugging log

        // Verify token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🔑 Decoded Token:", verified); // Debugging log

        // Ensure userId is present
        if (!verified.userId) {
            return res.status(400).json({ message: "Invalid token: userId missing" });
        }

        req.userId = verified.userId; // ✅ Fix: Set userId correctly
        console.log("✅ Set req.userId:", req.userId); // Debugging log

        next();
    } catch (err) {
        console.error("❌ Invalid Token Error:", err.message);
        res.status(400).json({ message: "Invalid Token!" });
    }
};
