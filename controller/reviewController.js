

const reviewService = require("../services/reviewsServices");


const addReview = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { rating } = req.body;
    const userId = req.user.userId; 

    if (!rating) {
      return res.status(400).json({ msg: "Rating is required" });
    }

    const reviewData = {
      product_id,
      user_id: userId,
      rating
    };

    const review = await reviewService.createReview(reviewData);

    res.status(201).json({
      msg: "Review added successfully",
      review,
    });
  } catch (error) {
    console.error("Error in addReview:", error);
    res.status(500).json({ msg: "please enter proper review between 1 to 5" });
  }
};
const getReviews = async (req, res) => {
  try {
    const { product_id } = req.params;
    const reviews = await reviewService.getProductReviews(product_id);

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ msg: "No reviews found for this product" });
    }

    res.status(200).json({
      msg: "Reviews fetched successfully",
      reviews,
    });
  } catch (error) {
    console.error("Error in getReviews:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existingReview = await reviewService.getReviewById(id);
    if (!existingReview) {
      return res.status(404).json({ msg: "Review not found" });
    }

    if (existingReview.user_id.toString() !== req.user.userId) {
      return res.status(403).json({ msg: "Unauthorized to update this review" });
    }

    const updatedReview = await reviewService.updateReview(id, updateData);

    res.status(200).json({
      msg: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    console.error("Error in updateReview:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const existingReview = await reviewService.getReviewById(id);
    if (!existingReview) {
      return res.status(404).json({ msg: "Review not found" });
    }

    
    if (existingReview.user_id.toString() !== req.user.userId) {
      return res.status(403).json({ msg: "Unauthorized to delete this review" });
    }

    await reviewService.deleteReview(id);

    res.status(200).json({ msg: "Review deleted successfully" });
  } catch (error) {
    console.error("Error in deleteReview:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = { addReview, getReviews, updateReview, deleteReview };
