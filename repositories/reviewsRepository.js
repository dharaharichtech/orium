
const ProductReview = require("../model/reviewsSchema");


const saveReview = async (reviewData) => {
  const review = new ProductReview(reviewData);
  return await review.save();
};


const getReviewsByProductId = async (productId) => {
  return await ProductReview.find({ product_id: productId }).populate("user_id", "name email");
};

const getReviewById = async (id) => {
  return await ProductReview.findById(id);
};


const updateReview = async (id, updateData) => {
  return await ProductReview.findByIdAndUpdate(id, updateData, { new: true });
};


const deleteReview = async (id) => {
  return await ProductReview.findByIdAndDelete(id);
};

module.exports = { saveReview, getReviewsByProductId, getReviewById, updateReview, deleteReview };
