const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            validate: {
                validator: Number.isInteger,
                message: "Rating must be an integer between 1 and 5"
            }
        },

        comment: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 500
        }
    },
    {
        timestamps: true
    }
);

reviewSchema.index(
    { customer: 1, restaurant: 1 },
    { unique: true }
);

module.exports = mongoose.model("Review", reviewSchema);