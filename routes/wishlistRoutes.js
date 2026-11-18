
const express = require("express");
const router = express.Router();

const wishlistController = require("../controllers/wishlistController");
const authMiddleware = require("../middleware/authMiddleware");

// Add product to wishlist
router.post(
    "/add",
    authMiddleware,
    wishlistController.addToWishlist
);

// Get wishlist
router.get(
    "/",
    authMiddleware,
    wishlistController.getWishlist
);

// Remove product from wishlist
router.delete(
    "/remove/:productId",
    authMiddleware,
    wishlistController.removeFromWishlist
);

module.exports = router;
