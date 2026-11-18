
const db = require("../config/db");

// Get all products with search and filters
const getAllProducts = (filters, callback) => {
    let sql = `
        SELECT p.*, c.name AS category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE 1 = 1
    `;

    const values = [];

    if (filters.search) {
        sql += " AND p.name LIKE ?";
        values.push("%" + filters.search + "%");
    }

    if (filters.category_id) {
        sql += " AND p.category_id = ?";
        values.push(filters.category_id);
    }

    if (filters.min_price !== undefined) {
        sql += " AND p.price >= ?";
        values.push(filters.min_price);
    }

    if (filters.max_price !== undefined) {
        sql += " AND p.price <= ?";
        values.push(filters.max_price);
    }

    const sortOptions = {
        price_low: "p.price ASC",
        price_high: "p.price DESC",
        newest: "p.created_at DESC",
        name: "p.name ASC"
    };

    const sort = sortOptions[filters.sort] || "p.id DESC";

    sql += " ORDER BY " + sort;

    db.query(sql, values, callback);
};

// Get product by ID
const getProductById = (id, callback) => {
    const sql = `
        SELECT p.*, c.name AS category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
    `;

    db.query(sql, [id], callback);
};

module.exports = {
    getAllProducts,
    getProductById
};
