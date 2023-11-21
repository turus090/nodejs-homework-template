const UsersModel = require("../schemas/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { checkToken } = require("../middleware/users");

const secretKey = "SomeText";

const authSchema = Joi.object({
  email: Joi.string().min(10).required(),
  password: Joi.string().min(10).required(),
});

const register = async (req, res, next) => {
  const { error } = authSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: "Invalid request body" });
  }
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
  const { error } = authSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: "Invalid request body" });
  }
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

const logout = async (req, res) => {
  const token = req.header("Authorization");
  if (!token) {
    res.status(401).json({ message: "Token is not found" });
  }
  jwt.verify(token, secretKey, async ({ email }) => {
    try {
      await UsersModel.findOneAndUpdate({ email }, { token: null });
      res.status(200).json({ message: "logout successfull" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};
const getUser = async (req, res) => {
  try {
    const user = await UsersModel.findOne({ email: req.email });
    res.status(200).json(user);
  } catch (err) {
    res.status(401).json({ message: "Not authorized" });
  }
};
module.exports = { register, login, logout, getUser, checkToken };
