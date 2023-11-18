const UsersModel = require("../schemas/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "SomeText";

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const candidate = await UsersModel.findOne({ email });

  if (candidate) {
    res.status(409).json({ message: "Email in use" });
  } else {
    try {
      const hashPassword = await bcrypt.hash(password, 10);
      const user = new UsersModel({
        email,
        password: hashPassword,
      });

      await user.save();
      res.status(201).json({ message: "User saved successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCandidate = await UsersModel.findOne({ email });
    if (!userCandidate) {
      res.status(401).json({ message: "Email or password is wrong" });
    } else {
      const isPasswordValid = await bcrypt.compare(
        password,
        userCandidate.password
      );
      if (!isPasswordValid) {
        res.status(401).json({ message: "Email or password is wrong" });
      } else {
        const token = jwt.sign({ email }, secretKey);
        try {
          await UsersModel.findOneAndUpdate({ email }, { token });
        } catch (err) {
          res.status(500).json({ message: "server error" });
        }
        res.json({ token });
      }
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

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

const logout = async (req, res) => {
  const token = req.header("Authorization");
  if (!token) {
    res.status(401).json({ message: "Token is not found" });
  }
  jwt.verify(token, secretKey, async (err, email) => {
    if (err) {
      res.status(403).json({ message: err.message });
    }
    try {
      await UsersModel.findOneAndUpdate({ email }, { token: null });
      res.status(200).json({ message: "logout successfull" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};

module.exports = { register, login, logout };
