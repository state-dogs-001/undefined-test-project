const mongoose = require("mongoose");

const tokenTemplate = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("user_token_col", tokenTemplate);
