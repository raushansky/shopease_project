
const userModel = require("../models/userModel");
const sendResponse = require("../utils/response");

// Get user profile
const getProfile = (req, res) => {
    userModel.findUserById(req.user.id, (err, result) => {
        if (err) {
            return sendResponse(res, 500, "Unable to fetch profile");
        }

        if (result.length === 0) {
            return sendResponse(res, 404, "User not found");
        }

        return sendResponse(
            res,
            200,
            "Profile fetched successfully",
            result[0]
        );
    });
};

// Update user profile
const updateProfile = (req, res) => {
    const { first_name, last_name } = req.body;

    if (
        typeof first_name !== "string" ||
        typeof last_name !== "string" ||
        !first_name.trim() ||
        !last_name.trim()
    ) {
        return sendResponse(
            res,
            400,
            "First name and last name are required"
        );
    }

    userModel.updateUser(
        req.user.id,
        {
            first_name: first_name.trim(),
            last_name: last_name.trim()
        },
        (err, result) => {
            if (err) {
                return sendResponse(res, 500, "Unable to update profile");
            }

            if (result.affectedRows === 0) {
                return sendResponse(res, 404, "User not found");
            }

            return sendResponse(
                res,
                200,
                "Profile updated successfully",
                {
                    first_name: first_name.trim(),
                    last_name: last_name.trim()
                }
            );
        }
    );
};

module.exports = {
    getProfile,
    updateProfile
};
