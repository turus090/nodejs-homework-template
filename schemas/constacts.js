const mongoose = require("mongoose");
const ContactsSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  favorite: {
    type: Boolean,
    require: true,
  },
});

module.exports = mongoose.model("contacts", ContactsSchema);
