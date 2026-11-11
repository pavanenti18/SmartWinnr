
const express = require("express");
const router = express.Router();

const {
  createRestaurant,
  getRestaurants,
  getRestaurantById
} = require("../controllers/restaurantController");

const { protect } = require("../middleware/auth");
const authorize = require("../middleware/authorize");

router.post("/", protect, authorize("admin"), createRestaurant);

router.get("/", getRestaurants);

router.get("/:id", getRestaurantById);

module.exports = router;
