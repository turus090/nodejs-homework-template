const express = require("express");
const { register } = require("../controllers/users");

const router = express.Router();

router.get("/", () => {});

router.post("/register", register);

module.exports = router;
