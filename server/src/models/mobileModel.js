const mongoose = require("mongoose");

// Schema of mobile collection
const mobileTemplate = mongoose.Schema({
  product_brand: {
    type: String,
    required: true,
  },
  product_name: {
    type: String,
    required: true,
    unique: true,
  },
  product_img: {
    type: String,
    require: true,
  },
  product_price: {
    type: Number,
    required: true,
  },
  product_description: {
    type: String,
    default: "This product not has description.",
  },
});

module.exports = mongoose.model("mobile_col", mobileTemplate);
