
const categoryModel = require("../models/categoryModel");
const sendResponse = require("../utils/response");

// Get all categories
const getCategories = (req, res) => {
    categoryModel.getAllCategories((err, result) => {
        if (err) {
            return sendResponse(res, 500, "Unable to fetch categories");
        }

        return sendResponse(
            res,
            200,
            "Categories fetched successfully",
            result
        );
    });
};

// Get category by ID
const getCategoryById = (req, res) => {
    const id = req.params.id;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return sendResponse(res, 400, "Invalid category ID");
    }

    categoryModel.getCategoryById(id, (err, result) => {
        if (err) {
            return sendResponse(res, 500, "Unable to fetch category");
        }

        if (result.length === 0) {
            return sendResponse(res, 404, "Category not found");
        }

        return sendResponse(res, 200, "Category found", result[0]);
    });
};

// Add category
const addCategory = (req, res) => {
    const { name } = req.body;

    if (!name || !name.trim()) {
        return sendResponse(res, 400, "Category name is required");
    }

    categoryModel.addCategory(name.trim(), (err, result) => {
        if (err) {
            return sendResponse(res, 500, "Unable to add category");
        }

        return sendResponse(res, 201, "Category added successfully", {
            id: result.insertId,
            name: name.trim()
        });
    });
};

// Update category
const updateCategory = (req, res) => {
    const id = req.params.id;
    const { name } = req.body;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return sendResponse(res, 400, "Invalid category ID");
    }

    if (!name || !name.trim()) {
        return sendResponse(res, 400, "Category name is required");
    }

    categoryModel.updateCategory(id, name.trim(), (err, result) => {
        if (err) {
            return sendResponse(res, 500, "Unable to update category");
        }

        if (result.affectedRows === 0) {
            return sendResponse(res, 404, "Category not found");
        }

        return sendResponse(res, 200, "Category updated successfully");
    });
};

// Delete category
const deleteCategory = (req, res) => {
    const id = req.params.id;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return sendResponse(res, 400, "Invalid category ID");
    }

    categoryModel.deleteCategory(id, (err, result) => {
        if (err) {
            return sendResponse(
                res,
                400,
                "Category cannot be deleted because products may be linked"
            );
        }

        if (result.affectedRows === 0) {
            return sendResponse(res, 404, "Category not found");
        }

        return sendResponse(res, 200, "Category deleted successfully");
    });
};

module.exports = {
    getCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory
};
