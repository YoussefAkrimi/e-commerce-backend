// subCategoryController.js
const subCategoryModel = require("../models/subCategoryModel");
const Category = require("../models/categoryModel");
module.exports = {
  // Create a Subcategory
  createSubCategory: async (req, res) => {
    try {
      // Check if the category ID is provided  :
      const { category, name, description } = req.body;
      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Category ID is required",
        });
      }
      

      const subCategory = new subCategoryModel(req.body);
      await subCategory.save();

      // Update the category to include this subcategory
      await Category.findByIdAndUpdate(req.body.category, {
        $push: { subCategories: subCategory._id },
      });

      res.status(201).json({
        success: true,
        message: "Subcategory created successfully",
        data: subCategory,

        /*  await categoryModel.findByIdAndUpdate(req.body.categry {
            $push : {subCategories: subCategory._id}
          } ) */
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        success: false,
        message: "An error occurred. Please try again.",
        data: null,
      });
    }
  },

  // Get all Subcategories
  getAllSubCategories: async (req, res) => {
    try {
      const subCategories = await subCategoryModel.find().populate("category");
      res.status(200).json({
        success: true,
        message: "Successfully retrieved subcategories",
        data: subCategories,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        success: false,
        message: "Failed to retrieve subcategories",
        data: null,
      });
    }
  },
  findSubCategoryById: async (req, res) => {
    try {
      const subCategoryId = req.params.id;
      const subCategory = await subCategoryModel
        .findById(subCategoryId)
        .populate("products") // Populates the products field with detailed product information
        .populate("category");
      res.status(200).json({
        success: true,
        message: "subCategory retrieved successfully",
        data: subCategory,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "failed to retrueve sub category",
        data: null,
      });
    }
  },
  deleteSubCategory: async (req, res) => {
    try {
      const subCategoryId = req.params.id;
      const subCategory = await subCategoryModel.findByIdAndDelete(
        subCategoryId
      );

      await Category.findByIdAndUpdate(
        subCategory.category,
        {
          $pull: { subCategories: subCategory._id },
        },
        { new: true } // Return the updated document
      );
      res.status(200).json({
        success: true,
        message: "sub categ deleted successfully",
        data: subCategory,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "failed to delete sub category",
        data: null,
      });
    }
  },
  updateSubCategory: async (req, res) => {
    try {
      const subCategoryId = req.params.id;
      const subCategory = await subCategoryModel.findByIdAndUpdate(
        subCategoryId,
        req.body,
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: " updated successfully",
        data: subCategory,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "failed to update",
        data: null,
      });
    }
  },

  // Delete all subcategories from the database
  // Delete all subcategories from the database

  deleteAllSubCategories: async (req, res) => {
    try {
      // Log the count of subcategories before deletion
      const count = await subCategoryModel.countDocuments();
      console.log(`Found ${count} subcategories`);
      // Delete all subcategories from the database
      const result = await subCategoryModel.deleteMany();

      // Check if any subcategories were deleted
      if (result.deletedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "No subcategories found to delete.",
          data: null,
        });
      }

      res.status(200).json({
        success: true,
        message: `${result.deletedCount} subcategory(ies) deleted successfully.`,
        data: null,
      });
    } catch (error) {
      // Log the full error message and stack trace
      console.error("Error deleting subcategories:", error.message);
      console.error(error.stack);
      res.status(400).json({
        success: false,
        message: "Failed to delete subcategories",
        data: null,
      });
    }
  },
};
