
const Restaurant = require("../models/Restaurant");
const Review = require("../models/Review");

// GET: Owner's restaurant and reviews
const getOwnerRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      owner: req.user.id
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "No restaurant assigned to this owner"
      });
    }

    const reviews = await Review.find({
      restaurant: restaurant._id
    })
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    const result = await Review.aggregate([
      {
        $match: {
          restaurant: restaurant._id
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 }
        }
      }
    ]);

    const averageRating = result.length
      ? Number(result[0].averageRating.toFixed(1))
      : 0;

    const reviewCount = result.length
      ? result[0].reviewCount
      : 0;

    res.json({
      restaurant,
      reviews,
      averageRating,
      reviewCount
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// PUT: Update owner's assigned restaurant
const updateOwnerRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      owner: req.user.id
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "No restaurant assigned to this owner"
      });
    }

    const allowedFields = [
      "name",
      "location",
      "cuisine",
      "description"
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        restaurant[field] = req.body[field];
      }
    });

    await restaurant.save();

    res.json({
      message: "Restaurant updated successfully",
      restaurant
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

module.exports = {
  getOwnerRestaurant,
  updateOwnerRestaurant
};
