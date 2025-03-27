const jwt = require("jsonwebtoken");
const NodeCache = require("node-cache");

const blacklist = new NodeCache({ stdTTL: 3600 }); // Tokens expire after 1 hour

module.exports = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access Denied! No Token Provided" });
    }

    try {
        // Extract token
        const token = authHeader.split(" ")[1].trim();
        console.log("🔍 Extracted Token:", token); // Debugging log

        // 🔴 Check if token is blacklisted
        if (blacklist.has(token)) {
            return res.status(401).json({ message: "Unauthorized! Token has been logged out." });
        }

        // Verify token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🔑 Decoded Token:", verified); // Debugging log

        // Ensure user ID exists in the token
        if (!verified.userId) {
            return res.status(400).json({ message: "Invalid token: user ID missing" });
        }

        req.userId = verified.userId; // ✅ Set userId directly (fix)
        console.log("✅ Set req.userId:", req.userId); // Debugging log

        next();
    } catch (err) {
        console.error("❌ Invalid Token Error:", err.message);
        res.status(401).json({ message: "Invalid Token!" });
    }
};

// Export blacklist to use in logout controller
module.exports.blacklist = blacklist;
