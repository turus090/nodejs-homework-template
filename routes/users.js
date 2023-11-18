const express = require("express");
const { register, login, logout } = require("../controllers/users");

const router = express.Router();

router.get("/", () => {});

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
module.exports = router;
