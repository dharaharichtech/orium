const Product = require("../model/productSchema");
const ProductDetail = require("../model/productDetailSchema");
const ProductCertificate = require("../model/productCertificateSchema");
const ProductCart = require("../model/productCartSchema");
const Wishlist = require("../model/wishlistSchema");
const Order = require("../model/orderSchema");

const saveProduct = async (productData) => {
  const product = new Product(productData);
  return await product.save();
};

const getAllProducts = async () => {
  return await Product.find();
};

const getProductById = async (id) => {
  return await Product.findById(id);
};


const getLastProduct = async () => {
  return await Product.findOne().sort({ date: -1 }); 
};


const getProductByTitle = async (title) => {
  return await Product.findOne({ title });
};

const updateProductById = (id, updates, options = {}) => {
  return Product.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
    ...options,
  });
};

const deleteProductById = async (id) => {
  return await Product.findByIdAndDelete(id);
};

const saveProductDetail = async (detailData) => {
  const detail = new ProductDetail(detailData);
  return await detail.save();
};

const getDetailsByProductId = async (product_id) => {
  return await ProductDetail.find({ product_id });
};

const updateDetailById = (id, updates, options = {}) => {
  return ProductDetail.findByIdAndUpdate(id, updates, {
    new: true,
    ...options,
  });
};

const deleteDetailById = async (id) => {
  return await ProductDetail.findByIdAndDelete(id);
};

//certificate 
const saveProductCertificate = async (certificateData) => {
  const certificate = new ProductCertificate(certificateData);
  return await certificate.save();
};

const getCertificateByTitle = async (product_id, certificate_title, sdg_title) => {
  return await ProductCertificate.findOne({ product_id, certificate_title, sdg_title });
};

const updateCertificateById = (id, updates, options = {}) => {
  return ProductCertificate.findByIdAndUpdate(id, updates, {
    new: true,
    ...options,
  });
};

const getCertificateById = async (id) => {
  return await ProductCertificate.findById(id);
};

const deleteCertificateById = async (id) => {
  return await ProductCertificate.findByIdAndDelete(id);
};

const getAllCertificates = async () => {
  return await ProductCertificate.find();
};

const saveCartItem = async (cartData) => {
  const cartItem = new ProductCart(cartData);
  return await cartItem.save();
};

const getCartItemByUserAndProduct = async (user_id, product_id) => {
  return await ProductCart.findOne({ user_id, product_id });
};

const getCartItemsByUser = async (user_id) => {
  return await ProductCart.find({ user_id }).populate("product_id", "title price images");
};

const getCartItemById = async (cart_id) => {
  return await ProductCart.findById(cart_id);
};

const deleteCartItemById = async (cart_id) => {
  return await ProductCart.findByIdAndDelete(cart_id);
};

const updateCartItemById = async (cart_id, updateData) => {
  return await ProductCart.findByIdAndUpdate(cart_id, updateData, { new: true });
};

const findWishlistItem = async (user_id, product_id) => {
  return await Wishlist.findOne({ user_id, product_id });
};

const addWishlistItem = async (user_id, product_id) => {
  const wishlistItem = new Wishlist({ user_id, product_id });
  return await wishlistItem.save();
};

const removeWishlistItem = async (user_id, product_id) => {
  return await Wishlist.findOneAndDelete({ user_id, product_id });
};

const findWishlistItemsByUser = async (user_id) => {
  return await Wishlist.find({ user_id }).populate(
    "product_id",
    "title price images"
  );
};

///// orders 

const saveOrder = async (orderData) => {
  const order = new Order(orderData);
  return await order.save();
};

const getOrderById = async (id)=>{
  return await Order.findById(id).populate("product_id", "title price images");
}
const updateOrderByMongoId = async (id, updateData) => {
  return await Order.findByIdAndUpdate(id, updateData, { new: true });
};

const getOrderByUser = async (user_id) => {
  return await Order.find({ user_id }).populate("product_id", "title price images");
};

const getAllOrders = async () => {
  return await Order.find()
    .populate("user_id", "firstname lastname email phone address city country pincode state ")
    .populate("product_id", "title price images");
};

module.exports = {
  updateOrderByMongoId,
  getLastProduct,
  getAllOrders,
  getOrderByUser,
  saveOrder,
  findWishlistItemsByUser,
  getOrderById,
  removeWishlistItem,
  findWishlistItem,
  addWishlistItem,
  updateCartItemById,
  deleteCartItemById,
  getCartItemById,
  getCartItemsByUser,
  saveCartItem,
  deleteCertificateById,
  getAllCertificates,
  saveProductCertificate,
  getCertificateByTitle,
  updateCertificateById,
  getCertificateById,
  getDetailsByProductId,
  updateDetailById,
  deleteDetailById,
  deleteProductById,
  updateProductById,
  getProductByTitle,
  getProductById,
  getAllProducts,
  saveProduct,
  saveProductDetail,
  getCartItemByUserAndProduct
};
