const multer = require("multer");
const jwt = require("jsonwebtoken");
const secretKey = "SomeText";
const gravatar = require("gravatar");
const checkToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    res.status(401).json({ message: "Token is not found" });
  }
  jwt.verify(token, secretKey, (err, email) => {
    if (err) {
      res.status(403).json({ message: "Invalid token" });
    }
    req.email = email;
    next();
  });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/avatars");
  },
  filename: (req, file, cb) => {
    cb(null, `${gravatar.url(req.email)}.${file.mimetype}`);
  },
});
const upload = multer({ storage });

module.exports = { checkToken, upload };
