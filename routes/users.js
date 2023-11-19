const express = require("express");
const {
  register,
  login,
  logout,
  checkToken,
  getUser,
} = require("../controllers/users");

const router = express.Router();

router.get("/", () => {});
router.get("/current", checkToken, getUser);

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
