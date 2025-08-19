const mongoose = require("mongoose");
const { Schema } = mongoose;

const productCertificateSchema = new Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", 
    required: true
  },
  certificate_img: {
    type: String,
  },
  certificate_title: {
    type: String,
  },
  sdg_title:{
    type: String,
  },
  sdg_img:{
    type: String,
  }

});

const ProductCertificate = mongoose.model("ProductCertificate", productCertificateSchema);

module.exports = ProductCertificate;
