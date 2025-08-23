
const reviewRepo = require("../repositories/reviewsRepository");

const createReview = async (reviewData) => {
  return await reviewRepo.saveReview(reviewData);
};

const getProductReviews = async (productId) => {
  return await reviewRepo.getReviewsByProductId(productId);
};

const getReviewById = async (id) => {
  return await reviewRepo.getReviewById(id);
};

const updateReview = async (id, updateData) => {
  return await reviewRepo.updateReview(id, updateData);
};

const deleteReview = async (id) => {
  return await reviewRepo.deleteReview(id);
};

module.exports = { createReview, getProductReviews, getReviewById, updateReview, deleteReview };
