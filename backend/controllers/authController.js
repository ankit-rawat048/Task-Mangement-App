const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.signup = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, username, email, password: hashedPassword });
        await user.save();

        const token = generateToken(user._id); // ✅ Generates correct token

        res.status(201).json({ message: "User created successfully!", token, userId: user._id });
    } catch (error) {
        res.status(500).json({ message: "Signup failed!", error });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id); // ✅ Generates correct token

        res.json({ token, userId: user._id });
    } catch (error) {
        res.status(500).json({ message: "Login failed!", error });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { userId, email, username } = req.body;

        let user;
        if (userId) {
            user = await User.findByIdAndDelete(userId);
        } else if (email) {
            user = await User.findOneAndDelete({ email });
        } else if (username) {
            user = await User.findOneAndDelete({ username });
        } else {
            return res.status(400).json({ message: "Provide userId, email, or username to delete." });
        }

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.json({ message: "User deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete user!", error });
    }
};