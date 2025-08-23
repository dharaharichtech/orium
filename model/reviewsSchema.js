const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewsSchema = new Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", 
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
   rating: {
    type: Number,  
    required: true,
    min: 1,
    max: 5
  },
 
  date: {
    type: Date,
    default: Date.now
  }
});

const ProductReview = mongoose.model("ProductReview", reviewsSchema);

module.exports = ProductReview;
