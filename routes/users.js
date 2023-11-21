const express = require("express");
const {
  register,
  login,
  logout,
  checkToken,
  getUser,
  updateAvatar,
} = require("../controllers/users");
const { upload } = require("../middleware/users");

const router = express.Router();

router.get("/", () => {});
router.get("/current", checkToken, getUser);

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.patch("/avatars", checkToken, upload.single("avatar"), updateAvatar);

module.exports = router;
