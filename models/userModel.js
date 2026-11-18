
const db = require("../config/db");

// Create new user
const createUser = (userData, callback) => {
    const sql = `
        INSERT INTO users (first_name, last_name, email, password)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [
        userData.first_name,
        userData.last_name,
        userData.email,
        userData.password
    ], callback);
};

// Find user by email
const findUserByEmail = (email, callback) => {
    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], callback);
};

// Find user by ID
const findUserById = (id, callback) => {
    const sql = `
        SELECT id, first_name, last_name, email, role, created_at
        FROM users
        WHERE id = ?
    `;

    db.query(sql, [id], callback);
};

// Update user profile
const updateUser = (id, userData, callback) => {
    const sql = `
        UPDATE users
        SET first_name = ?, last_name = ?
        WHERE id = ?
    `;

    db.query(sql, [
        userData.first_name,
        userData.last_name,
        id
    ], callback);
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    updateUser
};
