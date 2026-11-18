const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Request Check
app.use((req, res, next) => {
    console.log("Request:", req.method, req.url);
    next();
});
app.use(express.urlencoded({ extended: true }));

// API Routes
// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// Home route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to ShopEase API"
    });
});

// Not found route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found"
    });
});

// Start server after database connection
const PORT = process.env.PORT || 5000;

db.getConnection((err, connection) => {
    if (err) {
        console.log("Database connection failed:", err.message);
        return;
    }

    console.log("MySQL Database Connected Successfully!");
    connection.release();

    app.listen(PORT, () => {
        console.log(`ShopEase Server running on port ${PORT}`);
    });
});
