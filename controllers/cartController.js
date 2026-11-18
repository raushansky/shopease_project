
const cartModel = require("../models/cartModel");
const sendResponse = require("../utils/response");

// Add product to cart
const addToCart = (req, res) => {
    const { product_id, quantity } = req.body;

    if (
        !Number.isInteger(Number(product_id)) ||
        Number(product_id) <= 0
    ) {
        return sendResponse(res, 400, "Invalid product ID");
    }

    const productQuantity = quantity === undefined ? 1 : Number(quantity);

    if (
        !Number.isInteger(productQuantity) ||
        productQuantity <= 0
    ) {
        return sendResponse(res, 400, "Invalid quantity");
    }

    const userId = req.user.id;

    cartModel.addToCart(
        userId,
        Number(product_id),
        productQuantity,
        (err, result) => {
            if (err) {
                if (err.code === "ER_NO_REFERENCED_ROW_2") {
                    return sendResponse(res, 404, "Product not found");
                }

                return sendResponse(res, 500, "Unable to add product to cart");
            }

            return sendResponse(res, 200, "Product added to cart");
        }
    );
};

// Get user's cart
const getCart = (req, res) => {
    const userId = req.user.id;

    cartModel.getCart(userId, (err, result) => {
        if (err) {
            return sendResponse(res, 500, "Unable to fetch cart");
        }

        const totalAmount = result.reduce((total, item) => {
            return total + Number(item.subtotal);
        }, 0);

        return sendResponse(res, 200, "Cart fetched successfully", {
            items: result,
            total_items: result.reduce((total, item) => {
                return total + Number(item.quantity);
            }, 0),
            total_amount: totalAmount
        });
    });
};

// Update cart quantity
const updateCart = (req, res) => {
    const productId = Number(req.params.productId);
    const { quantity } = req.body;

    if (!Number.isInteger(productId) || productId <= 0) {
        return sendResponse(res, 400, "Invalid product ID");
    }

    if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
        return sendResponse(res, 400, "Invalid quantity");
    }

    cartModel.updateCartQuantity(
        req.user.id,
        productId,
        Number(quantity),
        (err, result) => {
            if (err) {
                return sendResponse(res, 500, "Unable to update cart");
            }

            if (result.affectedRows === 0) {
                return sendResponse(res, 404, "Cart item not found");
            }

            return sendResponse(res, 200, "Cart quantity updated");
        }
    );
};

// Remove product from cart
const removeFromCart = (req, res) => {
    const productId = Number(req.params.productId);

    if (!Number.isInteger(productId) || productId <= 0) {
        return sendResponse(res, 400, "Invalid product ID");
    }

    cartModel.removeFromCart(
        req.user.id,
        productId,
        (err, result) => {
            if (err) {
                return sendResponse(res, 500, "Unable to remove product");
            }

            if (result.affectedRows === 0) {
                return sendResponse(res, 404, "Cart item not found");
            }

            return sendResponse(res, 200, "Product removed from cart");
        }
    );
};

module.exports = {
    addToCart,
    getCart,
    updateCart,
    removeFromCart
};
