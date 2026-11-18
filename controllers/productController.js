
const productModel = require("../models/productModel");
const sendResponse = require("../utils/response");

// Get all products
const getProducts = (req, res) => {
    const filters = {
        search: req.query.search || "",
        category_id: req.query.category_id,
        min_price: req.query.min_price,
        max_price: req.query.max_price,
        sort: req.query.sort
    };

    // Check category ID
    if (
        filters.category_id &&
        (!Number.isInteger(Number(filters.category_id)) ||
            Number(filters.category_id) <= 0)
    ) {
        return sendResponse(res, 400, "Invalid category ID");
    }

    // Check minimum price
    if (
        filters.min_price !== undefined &&
        (!Number.isFinite(Number(filters.min_price)) ||
            Number(filters.min_price) < 0)
    ) {
        return sendResponse(res, 400, "Invalid minimum price");
    }

    // Check maximum price
    if (
        filters.max_price !== undefined &&
        (!Number.isFinite(Number(filters.max_price)) ||
            Number(filters.max_price) < 0)
    ) {
        return sendResponse(res, 400, "Invalid maximum price");
    }

    if (
        filters.min_price !== undefined &&
        filters.max_price !== undefined &&
        Number(filters.min_price) > Number(filters.max_price)
    ) {
        return sendResponse(res, 400, "Minimum price cannot be greater than maximum price");
    }

    // Convert price values into numbers
    if (filters.min_price !== undefined) {
        filters.min_price = Number(filters.min_price);
    }

    if (filters.max_price !== undefined) {
        filters.max_price = Number(filters.max_price);
    }

    productModel.getAllProducts(filters, (err, result) => {
        if (err) {
            return sendResponse(res, 500, "Unable to fetch products");
        }

        return sendResponse(
            res,
            200,
            "Products fetched successfully",
            result
        );
    });
};

// Get product by ID
const getProductById = (req, res) => {
    const id = req.params.id;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return sendResponse(res, 400, "Invalid product ID");
    }

    productModel.getProductById(id, (err, result) => {
        if (err) {
            return sendResponse(res, 500, "Unable to fetch product");
        }

        if (result.length === 0) {
            return sendResponse(res, 404, "Product not found");
        }

        return sendResponse(
            res,
            200,
            "Product fetched successfully",
            result[0]
        );
    });
};

module.exports = {
    getProducts,
    getProductById
};
