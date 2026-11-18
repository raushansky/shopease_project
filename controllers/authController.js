
const bcrypt = require("bcryptjs");

const userModel = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const sendResponse = require("../utils/response");

// User Registration
const register = (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    // Check required fields
    if (!first_name || !last_name || !email || !password) {
        return sendResponse(
            res,
            400,
            "Please fill all required fields"
        );
    }

    // Check password length
    if (password.length < 6) {
        return sendResponse(
            res,
            400,
            "Password must be at least 6 characters"
        );
    }

    const userEmail = email.trim().toLowerCase();

    // Check if email already exists
    userModel.findUserByEmail(userEmail, async (err, result) => {
        if (err) {
    console.error("Find User Database Error:", err);
    return sendResponse(res, 500, "Database error");
}

        if (result.length > 0) {
            return sendResponse(res, 409, "Email already registered");
        }

        try {
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            const userData = {
                first_name: first_name.trim(),
                last_name: last_name.trim(),
                email: userEmail,
                password: hashedPassword
            };

            // Save user in database
            userModel.createUser(userData, (err, result) => {
                if (err) {
                    if (err.code === "ER_DUP_ENTRY") {
                        return sendResponse(
                            res,
                            409,
                            "Email already registered"
                        );
                    }

                    return sendResponse(res, 500, "Unable to register user");
                }

                const user = {
                    id: result.insertId,
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    email: userData.email,
                    role: "user"
                };

                const token = generateToken(user);

                return sendResponse(res, 201, "Registration successful", {
                    user,
                    token
                });
            });

        } catch (error) {
            return sendResponse(res, 500, "Something went wrong");
        }
    });
};


// User Login
const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return sendResponse(
            res,
            400,
            "Email and password are required"
        );
    }

    const userEmail = email.trim().toLowerCase();

    userModel.findUserByEmail(userEmail, async (err, result) => {
        if (err) {
            return sendResponse(res, 500, "Database error");
        }

        if (result.length === 0) {
            return sendResponse(res, 401, "Invalid email or password");
        }

        const user = result[0];

        try {
            // Compare entered password with hashed password
            const isMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!isMatch) {
                return sendResponse(
                    res,
                    401,
                    "Invalid email or password"
                );
            }

            // Generate JWT token
            const token = generateToken(user);

            const userData = {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role
            };

            return sendResponse(res, 200, "Login successful", {
                user: userData,
                token
            });

        } catch (error) {
            return sendResponse(res, 500, "Something went wrong");
        }
    });
};


module.exports = {
    register,
    login
};
