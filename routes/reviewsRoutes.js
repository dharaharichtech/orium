const express = require('express');
const router = express.Router();
const { authenticate } = require("../utils/authValidation");
const { addReview, getReviews, updateReview, deleteReview } = require('../controller/reviewController');

router.post("/:product_id", authenticate, addReview);
router.get("/:product_id", getReviews);
router.patch("/:id", authenticate, updateReview);
router.delete("/:id", authenticate, deleteReview);

module.exports = router;