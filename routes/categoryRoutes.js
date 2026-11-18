
const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Get all categories
router.get("/", categoryController.getCategories);

// Get category by ID
router.get("/:id", categoryController.getCategoryById);

// Add category (Admin only)
router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    categoryController.addCategory
);

// Update category (Admin only)
router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    categoryController.updateCategory
);

// Delete category (Admin only)
router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    categoryController.deleteCategory
);

module.exports = router;
