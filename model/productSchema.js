const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  pro_id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  images: [
    {
      id: Number,
      filename: String,
      url: { type: String} 
    }
  ],

  date: {
    type: Date,
    default: Date.now,
  },
});

const Product = new mongoose.model("Product", productSchema);

module.exports = Product;
