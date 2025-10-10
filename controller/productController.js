const ProductCart = require("../model/productCartSchema");
const ProductCertificate = require("../model/productCertificateSchema");
const ProductDetail = require("../model/productDetailSchema");
const Product = require("../model/productSchema");
const path = require("path");
const productService = require("../services/productServices");
const api_url = process.env.API_URL

const createProduct = async (req, res) => {
try {
  const product = await productService.createProduct(req.body,req.files);
  res.status(201).json(product)
  
} catch (error) {
  console.error("Create Product Error:", error);
  res.status(400).json({
    message: error.message || "Failed to create product",
  });
  
}
};
const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    res.status(500).json({ msg: error.message });
  }
};
const getProductById = async (req, res) => {
  try {
      const product = await productService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);    
 
  } catch (error) {
    console.error("Error in getProductById:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    // const product = await Product.findByIdAndDelete(req.params.id);

      const product = await productService.deleteProductById(req.params.id);

    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
     return res.status(200).json({ message: "Product deleted successfully", product });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const updateProduct = async (req, res) => {
  try {

    let data = req.body;
    if (data.existingImages && typeof data.existingImages === "string") {
      try {
        data.existingImages = JSON.parse(data.existingImages);
      } catch {
        data.existingImages = [data.existingImages];
      }
    }
    const updatedProduct= await productService.updateProduct(
      req.params.id,
  data,
      req.files
    )

    if(!updatedProduct){
      return res.status(404).json({ message: "Product not found" });
    }


    
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error in updateProduct:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const addProductDetails = async (req, res) => {
  try {
const productDetails = await productService.addProductDetails(req.body);
res.status(201).json({
  message: "Product details added successfully",
  details:productDetails
})
   
  } catch (error) {
    console.error("Error in addProductDetails:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const updateProductDetails = async (req, res) => {
  try {
    const updatedDetail = await productService.updateProductDetails(req.params.id,req.body)
    res
      .status(200)
      .json({ msg: "Product detail updated successfully", detail:updatedDetail });
  } catch (error) {
    console.error("Error in updateProductDetails:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const deleteProductDetails = async (req, res) => {
  try {
   const deletedDetail = await productService.deleteProductDetails(req.params.id);

    res.status(200).json({
      msg: "Product detail deleted successfully",
      detail: deletedDetail,
    });
  } catch (error) {
    console.error("Error in deleteProductDetails:", error);
    res.status(400).json({ msg: error.message });
  }
};

const addWishlist = async(req,res)=>{
  try {
    const { user_id, product_id } = req.body;
    const wishlistItem = await productService.addWishlist(user_id, product_id);
    res.status(201).json({
      message: "Product added to wishlist successfully",
      item: wishlistItem
    });
  } catch (error) {
    console.error("Error in addWishlist:", error);
    res.status(400).json({ msg: error.message });
  }
};

const toggleWishlist = async (req, res) => {
  try {
    const { product_id } = req.params;
    const user_id = req.user.userId;

    const result = await productService.toggleWishlist(user_id, product_id);

   res.status(200).json(result);
  } catch (error) {
    console.error("Error in toggleWishlist:", error);
    res.status(400).json({ msg: error.message });
  }
};

const getWishlist = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const wishlist = await productService.getWishlist(user_id);
    res.status(200).json(wishlist);
  } catch (error) {
    console.error("Error in getWishlist:", error);
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getWishlist,
  toggleWishlist,
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  addProductDetails,
  updateProductDetails,
  deleteProductDetails,
};
