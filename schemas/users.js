const mongoose = require("mongoose");
const UsersSchema = mongoose.Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("users", UsersSchema);
