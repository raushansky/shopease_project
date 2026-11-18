
const db = require("../config/db");
const sendResponse = require("../utils/response");

// Get dashboard statistics
const getDashboard = (req, res) => {
    const sql = `
        SELECT
            (SELECT COUNT(*) FROM users WHERE role = 'user') AS total_users,
            (SELECT COUNT(*) FROM products) AS total_products,
            (SELECT COUNT(*) FROM categories) AS total_categories,
            (SELECT COUNT(*) FROM orders) AS total_orders,
            (SELECT COALESCE(SUM(total_amount), 0)
             FROM orders
             WHERE status = 'Delivered') AS total_sales
    `;

    db.query(sql, (err, result) => {
        if (err) {
            return sendResponse(res, 500, "Unable to fetch dashboard");
        }

        return sendResponse(
            res,
            200,
            "Dashboard data fetched successfully",
            result[0]
        );
    });
};

// Get all orders
const getAllOrders = (req, res) => {
    const sql = `
        SELECT
            orders.id,
            orders.user_id,
            users.first_name,
            users.last_name,
            orders.total_amount,
            orders.address,
            orders.status,
            orders.created_at
        FROM orders
        JOIN users ON orders.user_id = users.id
        ORDER BY orders.created_at DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            return sendResponse(res, 500, "Unable to fetch orders");
        }

        return sendResponse(
            res,
            200,
            "All orders fetched successfully",
            result
        );
    });
};

// Update order status
const updateOrderStatus = (req, res) => {
    const orderId = Number(req.params.id);
    const { status } = req.body;

    const allowedStatus = [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled"
    ];

    if (!Number.isInteger(orderId) || orderId <= 0) {
        return sendResponse(res, 400, "Invalid order ID");
    }

    if (!allowedStatus.includes(status)) {
        return sendResponse(res, 400, "Invalid order status");
    }

    const sql = `
        UPDATE orders
        SET status = ?
        WHERE id = ?
    `;

    db.query(sql, [status, orderId], (err, result) => {
        if (err) {
            return sendResponse(res, 500, "Unable to update order status");
        }

        if (result.affectedRows === 0) {
            return sendResponse(res, 404, "Order not found");
        }

        return sendResponse(res, 200, "Order status updated successfully");
    });
};

module.exports = {
    getDashboard,
    getAllOrders,
    updateOrderStatus
};
