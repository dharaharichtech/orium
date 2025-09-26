const mongoose = require("mongoose");
const { Schema } = mongoose;

const productCartSchema = new Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", 
    required: true
  },
  quantity: {
    type: String,
  },
  subtotal: {
    type: String,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

});

const ProductCart = mongoose.model("ProductCart", productCartSchema);

module.exports = ProductCart;


