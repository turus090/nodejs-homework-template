const UsersModel = require("../schemas/users");
const bcrypt = require("bcrypt");

const register = async (req, res, next) => {
  const { email, password } = req.body;

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
};

export { register };
