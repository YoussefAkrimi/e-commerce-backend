// controllers/categoryController.js
/* const categoryModel = require("../models/categoryModel");*/

const Category = require("../models/categoryModel");

module.exports = {
  createCategory: async (req, res) => {
    try {
      req.body.image = req.file.filename;

      const category = new Category(req.body);
      await category.save();
      res
        .status(201)
        .json({ success: true, message: "Category created", data: category });
    } catch (error) {
      // Log the error to the console for debugging
      console.error("Error deleting order:", error);
      console.error(error);
      res.status(400).json({
        success: false,
        message: "Error creating category",
        error: error.message,
      });
    }
  },

  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find().populate("subCategories");
      res.status(200).json({ success: true, data: categories });
    } catch (error) {
      res
        .status(400)
        .json({ success: false, message: "Failed to retrieve categories" });
    }
  },

  findCategoryById: async (req, res) => {
    try {
      const categoryId = req.params.id;
      const category = await Category.findById(categoryId).populate(
        "subCategories"
      ); // this Populates subcategory details

      res.status(200).json({
        success: true,
        message: "category retrieved successfully",
        data: category,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "failed to find category",
        data: null,
      });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const categoryId = req.params.id;
      const category = await Category.findByIdAndDelete(categoryId);
      res.status(200).json({
        success: true,
        message: "category deleted",
        data: category,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "failed to delete category",
        data: null,
      });
    }
  },
  updateCategories: async (req, res) => {
    try {
      // Check if a file is included in the request and update image field only if present
      if (req.file) {
        req.body.image = req.file.filename; // Only update image if file is included
      }

      console.log("Update Data:", req.body);

      const categoryId = req.params.id;
      const category = await Category.findByIdAndUpdate(categoryId, req.body, {
        new: true,
      });
      res.status(200).json({
        success: true,
        message: "category updated",
        data: category,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "failed to update",
        data: null,
      });
    }
  },
};
