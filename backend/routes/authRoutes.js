const express = require("express");
const { signup, login, deleteUser } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.delete("/delete", deleteUser);

module.exports = router;
