require("node:dns/promises").setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const { protect } = require("./middleware/auth");
const authorize = require("./middleware/authorize");

const restaurantRoutes = require("./routes/restaurantRoutes");

const reviewRoutes = require("./routes/reviewRoutes");

const ownerRoutes = require("./routes/ownerRoutes");

const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/restaurants", restaurantRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/owner", ownerRoutes);

app.use("/api/admin", adminRoutes);

// ADD PROTECTED ROUTES HERE
app.get("/api/protected", protect, (req, res) => {
    res.json({
        message: "Protected route accessed successfully",
        user: req.user
    });
});

app.get("/api/admin-test", protect, authorize("admin"), (req, res) => {
    res.json({
        message: "Admin access granted"
    });
});

app.get("/", (req, res) => {
    res.send("Smart Winnr Backend is Running!");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();