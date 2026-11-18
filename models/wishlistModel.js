
const db = require("../config/db");

// Add product to wishlist
const addToWishlist = (userId, productId, callback) => {
    const sql = `
        INSERT INTO wishlist (user_id, product_id)
        VALUES (?, ?)
    `;

    db.query(sql, [userId, productId], callback);
};

// Get user's wishlist
const getWishlist = (userId, callback) => {
    const sql = `
        SELECT
            wishlist.id,
            products.id AS product_id,
            products.name,
            products.description,
            products.price,
            products.image_url,
            products.stock
        FROM wishlist
        JOIN products ON wishlist.product_id = products.id
        WHERE wishlist.user_id = ?
        ORDER BY wishlist.id DESC
    `;

    db.query(sql, [userId], callback);
};

// Remove product from wishlist
const removeFromWishlist = (userId, productId, callback) => {
    const sql = `
        DELETE FROM wishlist
        WHERE user_id = ? AND product_id = ?
    `;

    db.query(sql, [userId, productId], callback);
};

module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist
};
