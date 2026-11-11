
const Restaurant = require("../models/Restaurant");

const Review = require("../models/Review");

// CREATE RESTAURANT (Admin)
const createRestaurant = async (req, res) => {
    try {
        const {
            name,
            location,
            cuisine,
            description,
            owner
        } = req.body;

        if (!name || !location || !cuisine || !owner) {
            return res.status(400).json({
                message: "Name, location, cuisine and owner are required"
            });
        }

        const restaurant = await Restaurant.create({
            name,
            location,
            cuisine,
            description,
            owner
        });

        res.status(201).json({
            message: "Restaurant created successfully",
            restaurant
        });

    } catch (error) {
        res.status(500).json({
            message: "Restaurant creation failed",
            error: error.message
        });
    }
};

// GET ALL RESTAURANTS (Public)

const getRestaurants = async (req, res) => {
    try {
        const { search, location, cuisine } = req.query;

        const filter = {};

        if (search) {
            filter.name = {
                $regex: search,
                $options: "i"
            };
        }

        if (location) {
            filter.location = {
                $regex: location,
                $options: "i"
            };
        }

        if (cuisine) {
            filter.cuisine = {
                $regex: cuisine,
                $options: "i"
            };
        }

        const restaurants = await Restaurant.find(filter)
            .populate("owner", "name email");

            const restaurantsWithRatings = await Promise.all(
            restaurants.map(async (restaurant) => {
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

                return {
                ...restaurant.toObject(),
                averageRating: result.length ? Number(result[0].averageRating.toFixed(1)) : 0,
                reviewCount: result.length ? result[0].reviewCount : 0
                };
            })
            );

        res.status(200).json({
            count: restaurantsWithRatings.length,
            restaurants: restaurantsWithRatings
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch restaurants",
            error: error.message
        });
    }
};



const getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id)
            .populate("owner", "name email");

        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        res.status(200).json({
            restaurant
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch restaurant",
            error: error.message
        });
    }
};



module.exports = {
    createRestaurant,
    getRestaurants,
    getRestaurantById
};



