
const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

// Get all products with search and filters
router.get("/", productController.getProducts);

// Get product by ID
router.get("/:id", productController.getProductById);

module.exports = router;
