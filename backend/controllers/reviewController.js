
const Review = require("../models/Review");
const Restaurant = require("../models/Restaurant");

// CREATE REVIEW
const createReview = async (req, res) => {
  try {
    const { restaurant, rating, comment } = req.body;

    if (!restaurant || !rating || !comment) {
      return res.status(400).json({
        message: "Restaurant, rating and comment are required"
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5"
      });
    }

    const restaurantExists = await Restaurant.findById(restaurant);

    if (!restaurantExists) {
      return res.status(404).json({
        message: "Restaurant not found"
      });
    }

    const existingReview = await Review.findOne({
      customer: req.user.id,
      restaurant
    });

    if (existingReview) {
      return res.status(409).json({
        message: "You have already reviewed this restaurant"
      });
    }

    const review = await Review.create({
      customer: req.user.id,
      restaurant,
      rating,
      comment
    });

    const populatedReview = await Review.findById(review._id)
      .populate("customer", "name email")
      .populate("restaurant", "name location");

    res.status(201).json({
      message: "Review submitted successfully",
      review: populatedReview
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// GET RESTAURANT REVIEWS
const getRestaurantReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      restaurant: req.params.restaurantId
    })
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    res.json({ reviews });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// UPDATE OWN REVIEW
const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    if (review.customer.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only update your own review"
      });
    }

    const { rating, comment } = req.body;

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          message: "Rating must be between 1 and 5"
        });
      }

      review.rating = rating;
    }

    if (comment !== undefined) {
      review.comment = comment;
    }

    await review.save();

    const updatedReview = await Review.findById(review._id)
      .populate("customer", "name email")
      .populate("restaurant", "name location");

    res.json({
      message: "Review updated successfully",
      review: updatedReview
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// DELETE OWN REVIEW
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    if (review.customer.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only delete your own review"
      });
    }

    await review.deleteOne();

    res.json({
      message: "Review deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createReview,
  getRestaurantReviews,
  updateReview,
  deleteReview
};
