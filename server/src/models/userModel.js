const mongoose = require("mongoose");

// Schema of user collection
const userTemplate = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date_create: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("user_col", userTemplate);
