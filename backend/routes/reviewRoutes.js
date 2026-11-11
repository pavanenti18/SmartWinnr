
const express = require("express");
const router = express.Router();

const {
  createReview,
  getRestaurantReviews,
  updateReview,
  deleteReview
} = require("../controllers/reviewController");

const { protect } = require("../middleware/auth");
const authorize = require("../middleware/authorize");

// Public reviews
router.get("/restaurant/:restaurantId", getRestaurantReviews);

// Customer review operations
router.post("/", protect, authorize("customer"), createReview);
router.put("/:id", protect, authorize("customer"), updateReview);
router.delete("/:id", protect, authorize("customer"), deleteReview);

module.exports = router;
