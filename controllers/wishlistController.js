
const wishlistModel = require("../models/wishlistModel");
const sendResponse = require("../utils/response");

// Add product to wishlist
const addToWishlist = (req, res) => {
    const { product_id } = req.body;

    if (!Number.isInteger(Number(product_id)) || Number(product_id) <= 0) {
        return sendResponse(res, 400, "Invalid product ID");
    }

    wishlistModel.addToWishlist(
        req.user.id,
        Number(product_id),
        (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return sendResponse(res, 409, "Product already in wishlist");
                }

                if (err.code === "ER_NO_REFERENCED_ROW_2") {
                    return sendResponse(res, 404, "Product not found");
                }

                return sendResponse(res, 500, "Unable to add product to wishlist");
            }

            return sendResponse(res, 201, "Product added to wishlist");
        }
    );
};

// Get wishlist
const getWishlist = (req, res) => {
    wishlistModel.getWishlist(req.user.id, (err, result) => {
        if (err) {
            return sendResponse(res, 500, "Unable to fetch wishlist");
        }

        return sendResponse(
            res,
            200,
            "Wishlist fetched successfully",
            result
        );
    });
};

// Remove product from wishlist
const removeFromWishlist = (req, res) => {
    const productId = Number(req.params.productId);

    if (!Number.isInteger(productId) || productId <= 0) {
        return sendResponse(res, 400, "Invalid product ID");
    }

    wishlistModel.removeFromWishlist(
        req.user.id,
        productId,
        (err, result) => {
            if (err) {
                return sendResponse(res, 500, "Unable to remove product");
            }

            if (result.affectedRows === 0) {
                return sendResponse(res, 404, "Product not found in wishlist");
            }

            return sendResponse(res, 200, "Product removed from wishlist");
        }
    );
};

module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist
};
