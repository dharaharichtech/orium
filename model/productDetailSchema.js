const mongoose = require("mongoose");
const { Schema } = mongoose;

const productDetailSchema = new Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", 
    required: true
  },
  product_que: {
    type: String,
    required: true
  },
  product_ans: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const ProductDetail = mongoose.model("ProductDetail", productDetailSchema);

module.exports = ProductDetail;
