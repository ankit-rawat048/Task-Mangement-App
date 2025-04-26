const jwt = require("jsonwebtoken");
const NodeCache = require("node-cache");

const blacklist = new NodeCache({ stdTTL: 3600 });

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied! No Token Provided" });
  }

  const token = authHeader.split(" ")[1].trim();

  if (blacklist.has(token)) {
    return res.status(401).json({ message: "Unauthorized! Token has been logged out." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified.userId) {
      return res.status(400).json({ message: "Invalid token: user ID missing" });
    }

    req.userId = verified.userId;
    next();
  } catch (err) {
    console.error("❌ Invalid Token Error:", err.message);
    res.status(401).json({ message: "Invalid Token!" });
  }
};

module.exports = authMiddleware;
module.exports.blacklist = blacklist;
