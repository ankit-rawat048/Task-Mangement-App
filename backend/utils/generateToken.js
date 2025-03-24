const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
    return jwt.sign(
        { userId: userId.toString() },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

module.exports = generateToken;
