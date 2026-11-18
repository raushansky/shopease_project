
const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

// Create new order
router.post(
    "/create",
    authMiddleware,
    orderController.createOrder
);

// Get user's order history
router.get(
    "/my-orders",
    authMiddleware,
    orderController.getMyOrders
);

// Get order details by ID
router.get(
    "/:id",
    authMiddleware,
    orderController.getOrderDetails
);

module.exports = router;
