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

module.exports = { checkToken };
