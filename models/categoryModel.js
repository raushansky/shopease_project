
const db = require("../config/db");

// Get all categories
const getAllCategories = (callback) => {
    const sql = "SELECT * FROM categories ORDER BY id DESC";

    db.query(sql, callback);
};

// Get category by ID
const getCategoryById = (id, callback) => {
    const sql = "SELECT * FROM categories WHERE id = ?";

    db.query(sql, [id], callback);
};

// Add new category
const addCategory = (name, callback) => {
    const sql = "INSERT INTO categories (name) VALUES (?)";

    db.query(sql, [name], callback);
};

// Update category
const updateCategory = (id, name, callback) => {
    const sql = "UPDATE categories SET name = ? WHERE id = ?";

    db.query(sql, [name, id], callback);
};

// Delete category
const deleteCategory = (id, callback) => {
    const sql = "DELETE FROM categories WHERE id = ?";

    db.query(sql, [id], callback);
};

module.exports = {
    getAllCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory
};
