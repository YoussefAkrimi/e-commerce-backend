const express = require("express");
const route = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middleware/upload");
const routeProtection = require("../middleware/authenticateToken");



route.post(
  "/",
  routeProtection,
  upload.array("image"),
  productController.createProduct
);
route.get("/", productController.getAllProducts);
route.get("/:id", productController.getProductById);
route.put(
  "/:id",
  routeProtection,
  upload.array("image"),
  productController.updateProduct
);
route.delete("/:id", routeProtection, productController.deleteProduct);
module.exports = route;
