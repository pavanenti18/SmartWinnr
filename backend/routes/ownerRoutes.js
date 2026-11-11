
const express = require("express");
const router = express.Router();

const {
  getOwnerRestaurant,
  updateOwnerRestaurant
} = require("../controllers/ownerController");

const { protect } = require("../middleware/auth");
const authorize = require("../middleware/authorize");

// All owner routes require owner login
router.use(protect, authorize("owner"));

router.get("/restaurant", getOwnerRestaurant);
router.put("/restaurant", updateOwnerRestaurant);

module.exports = router;
