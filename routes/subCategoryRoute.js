// subCategoryRoute.js
const express = require("express");
const subCategoryController = require("../controllers/subCategoryController"); // Import subCategoryController
const route = express.Router();
const routeProtection = require("../middleware/authenticateToken");

//route for deleting all subCategories
route.delete("/deleteAll", subCategoryController.deleteAllSubCategories);
module.exports = route;

// Route for creating a subcategory
route.post("/",  subCategoryController.createSubCategory);
route.get("/",  subCategoryController.getAllSubCategories);
route.get("/:id",  subCategoryController.findSubCategoryById);
route.delete("/:id", routeProtection, subCategoryController.deleteSubCategory);
route.put("/:id", routeProtection, subCategoryController.updateSubCategory);
