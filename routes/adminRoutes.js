
const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Admin dashboard
router.get(
    "/dashboard",
    authMiddleware,
    adminMiddleware,
    adminController.getDashboard
);

// Get all orders
router.get(
    "/orders",
    authMiddleware,
    adminMiddleware,
    adminController.getAllOrders
);

// Update order status
router.put(
    "/orders/:id/status",
    authMiddleware,
    adminMiddleware,
    adminController.updateOrderStatus
);

module.exports = router;
