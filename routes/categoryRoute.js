// routes/categoryRoute.js
const express = require("express");
const route = express.Router();
const upload = require("../middleware/upload");
const categoryController = require("../controllers/categoryController");
const routeProtection = require("../middleware/authenticateToken");

route.post(
  "/",
  routeProtection,
  upload.single("image"),
  categoryController.createCategory
);
route.get("/", categoryController.getAllCategories);
route.get("/:id", categoryController.findCategoryById);
route.delete("/:id", routeProtection, categoryController.deleteCategory);
route.put(
  "/:id",
  routeProtection,
  upload.single("image"),
  categoryController.updateCategories
);
module.exports = route;
