const express = require("express");
const { signup, login, deleteUser, logout } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.delete("/delete", deleteUser);

module.exports = router;
