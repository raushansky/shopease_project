
const db = require("../config/db");

// Create new order
const createOrder = (userId, totalAmount, address, callback) => {
    const sql = `
        INSERT INTO orders (user_id, total_amount, address)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [userId, totalAmount, address], callback);
};

// Save order items
const addOrderItems = (orderId, items, callback) => {
    const sql = `
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES ?
    `;

    const values = items.map((item) => [
        orderId,
        item.product_id,
        item.quantity,
        item.price
    ]);

    db.query(sql, [values], callback);
};

// Get user's order history
const getUserOrders = (userId, callback) => {
    const sql = `
        SELECT *
        FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [userId], callback);
};

// Get order details
const getOrderById = (orderId, userId, callback) => {
    const sql = `
        SELECT
            orders.id AS order_id,
            orders.total_amount,
            orders.address,
            orders.status,
            orders.created_at,
            order_items.product_id,
            order_items.quantity,
            order_items.price,
            products.name AS product_name,
            products.image_url
        FROM orders
        JOIN order_items ON orders.id = order_items.order_id
        JOIN products ON order_items.product_id = products.id
        WHERE orders.id = ? AND orders.user_id = ?
    `;

    db.query(sql, [orderId, userId], callback);
};

// Update order status
const updateOrderStatus = (orderId, status, callback) => {
    const sql = `
        UPDATE orders
        SET status = ?
        WHERE id = ?
    `;

    db.query(sql, [status, orderId], callback);
};

module.exports = {
    createOrder,
    addOrderItems,
    getUserOrders,
    getOrderById,
    updateOrderStatus
};
