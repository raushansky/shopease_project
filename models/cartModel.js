
const db = require("../config/db");

// Add product to cart
const addToCart = (userId, productId, quantity, callback) => {
    const sql = `
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE quantity = quantity + ?
    `;

    db.query(
        sql,
        [userId, productId, quantity, quantity],
        callback
    );
};

// Get user's cart
const getCart = (userId, callback) => {
    const sql = `
        SELECT
            cart_items.id,
            cart_items.product_id,
            cart_items.quantity,
            products.name,
            products.price,
            products.image_url,
            products.stock,
            (products.price * cart_items.quantity) AS subtotal
        FROM cart_items
        JOIN products ON cart_items.product_id = products.id
        WHERE cart_items.user_id = ?
        ORDER BY cart_items.id DESC
    `;

    db.query(sql, [userId], callback);
};

// Update product quantity
const updateCartQuantity = (userId, productId, quantity, callback) => {
    const sql = `
        UPDATE cart_items
        SET quantity = ?
        WHERE user_id = ? AND product_id = ?
    `;

    db.query(sql, [quantity, userId, productId], callback);
};

// Remove product from cart
const removeFromCart = (userId, productId, callback) => {
    const sql = `
        DELETE FROM cart_items
        WHERE user_id = ? AND product_id = ?
    `;

    db.query(sql, [userId, productId], callback);
};

// Clear user's cart
const clearCart = (userId, callback) => {
    const sql = "DELETE FROM cart_items WHERE user_id = ?";

    db.query(sql, [userId], callback);
};

module.exports = {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart,
    clearCart
};
