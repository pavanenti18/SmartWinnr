
const express = require("express");
const router = express.Router();

const {
  getDashboard,
  getUsers,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getReviews,
  deleteReview
} = require("../controllers/adminController");

const { protect } = require("../middleware/auth");
const authorize = require("../middleware/authorize");

router.use(protect, authorize("admin"));

router.get("/dashboard", getDashboard);
router.get("/users", getUsers);

router.post("/restaurants", createRestaurant);
router.put("/restaurants/:id", updateRestaurant);
router.delete("/restaurants/:id", deleteRestaurant);

router.get("/reviews", getReviews);
router.delete("/reviews/:id", deleteReview);

module.exports = router;
