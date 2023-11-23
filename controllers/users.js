const UsersModel = require("../schemas/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const gravatar = require("gravatar");
const randomstring = require("randomstring");
const elasticemail = require("elasticemail");

const config = require("../config");

const { checkToken } = require("../middleware/users");
const secretKey = "SomeText";

const authSchema = Joi.object({
  email: Joi.string().min(10).required(),
  password: Joi.string().min(10).required(),
});

const clientEmail = elasticemail.createClient({
  username: config.emailUsername,
  apiKey: config.emailAPI,
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
      const userInfo = {
        email,
        password: hashPassword,
        avatarURL: gravatar.url(email, { protocol: "http" }),
        verificationToken: randomstring.generate(10),
      };
      const user = new UsersModel(userInfo);
      const msg = {
        from: "taurus090@gmail.com",
        from_name: "Vasia",
        to: userInfo.email,
        subject: "Verification  your account",
        body_text: `Click here to verify your account: http://localhost:3000/auth/verify/${userInfo.verificationToken}`,
      };

      clientEmail.mailer.send(msg, (err, result) => {
        if (err) {
          return console.error(err);
        }
        console.log(result);
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

const updateAvatar = async (req, res) => {
  try {
    const user = await UsersModel.findOne({ email: req.email });
    res.status(200).json({
      avatarURL: `http://localhost:3000/avatars/${user.avatarURL}`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const verify = async (req, res) => {
  if (!req.body.email) {
    return res.status(400).json({ message: "Bad request" });
  }
  try {
    await UsersModel.findOneAndUpdate(
      { email: req.body.email },
      { verify: true }
    );
    res.status(200).json({ message: "Email has been confirm" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = {
  register,
  login,
  logout,
  getUser,
  checkToken,
  updateAvatar,
  verify,
};
