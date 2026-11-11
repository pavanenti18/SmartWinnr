
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const Review = require("../models/Review");

const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRestaurants = await Restaurant.countDocuments();
    const totalReviews = await Review.countDocuments();

    const result = await Review.aggregate([
      { $group: { _id: null, average: { $avg: "$rating" } } }
    ]);

    res.json({
      totalUsers,
      totalRestaurants,
      totalReviews,
      platformAverageRating: result.length
        ? Number(result[0].average.toFixed(1))
        : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRestaurant = async (req, res) => {
  try {
    const { name, location, cuisine, description, owner } = req.body;

    if (!name || !location || !cuisine || !owner) {
      return res.status(400).json({
        message: "Name, location, cuisine and owner are required"
      });
    }

    const ownerUser = await User.findById(owner);

    if (!ownerUser || ownerUser.role !== "owner") {
      return res.status(400).json({ message: "Invalid restaurant owner" });
    }

    const restaurant = await Restaurant.create({
      name, location, cuisine, description, owner
    });

    res.status(201).json({ message: "Restaurant created", restaurant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const allowed = ["name", "location", "cuisine", "description", "owner"];
    const updates = {};

    allowed.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (updates.owner) {
      const ownerUser = await User.findById(updates.owner);
      if (!ownerUser || ownerUser.role !== "owner") {
        return res.status(400).json({ message: "Invalid restaurant owner" });
      }
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id, updates, { new: true, runValidators: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json({ message: "Restaurant updated", restaurant });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    await Review.deleteMany({ restaurant: restaurant._id });

    res.json({ message: "Restaurant and its reviews deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("customer", "name email")
      .populate("restaurant", "name location")
      .sort({ createdAt: -1 });

    res.json({ count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboard,
  getUsers,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getReviews,
  deleteReview
};
