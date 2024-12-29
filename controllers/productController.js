const ProductModel = require("../models/productModel");
const subCategory = require("../models/subCategoryModel");
const Provider = require("../models/providerModel");
const productModel = require("../models/productModel");
module.exports = {
  createProduct: async (req, res) => {
    try {
      // Ensure req.files is an array (or empty array if undefined)
      const galleries =
        req.files && req.files.length > 0
          ? req.files.map((file) => ({ image: file.filename }))
          : [];

      req.body["galleries"] = galleries; // Safely assign galleries

      // Create the new product
      const product = new ProductModel(req.body);
      await product.save();

      // Update the subcategory to include this new product
      await subCategory.findByIdAndUpdate(
        product.subcategory, // reference to subcategory from product's subcategory field
        { $push: { products: product._id } } // push the new product's ID to the products array
      );
      // If providers are passed, update the provider documents to link them to the product
      if (req.body.providers) {
        await Provider.updateMany(
          { _id: { $in: req.body.providers } }, // Update multiple providers
          { $push: { products: product._id } } // Add product ID to each provider
        );
      }
      res.status(200).json({
        success: true,
        message: "successfully created product",
        data: product,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "failed to create product" + error.message,
        data: null,
      });
    }
  },

  getAllProducts: async (req, res) => {
    try {
      const products = await ProductModel.find().populate("subcategory");
      res.status(200).json({
        success: true,
        message: "successfullt retrieved all products",
        data: products,
      });
    } catch (error) {
      console.error("error retrieving all products", error);
      res.status(400).json({
        success: false,
        message: "failed to retrieve all products",
        data: null,
        error: error.message,
      });
    }
  },

  getProductById: async (req, res) => {
    try {
      const product = await ProductModel.findById(req.params.id)
        .populate("providers")
        .populate("orders")
        .populate("subcategory");

      // Ensure galleries is always an array
      if (!Array.isArray(product.galleries)) {
        product.galleries = [];
      }
      console.log("Galleries:", product.galleries); // Log the galleries to see the URLs

      res.status(200).json({
        success: true,
        message: "product retrieved successfully",
        data: product,
      });
    } catch (error) {
      console.error("error retrieving the product by id", error);
      res.status(400).json({
        success: false,
        message: "failed to retrieve product by id" + error.message,
        data: null,
        error: error.message,
      });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const product = await ProductModel.findByIdAndDelete(req.params.id);

      // If the product doesn't exist, return an error
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found" + error.message,
          data: null,
        });
      }
      // Remove the product's ID from the related subcategory
      await subCategory.findByIdAndUpdate(product.subcategory, {
        $pull: { products: product._id },
      });
      // Remove the product's reference from the providers' product array
      await Provider.updateMany(
        { products: product._id },
        { $pull: { products: product._id } } // Remove the product from the array of products
      );

      res.status(200).json({
        success: true,
        message: "successfully deleted product",
        data: product,
      });
    } catch (error) {
      console.error("error deleting product", error);
      res.status(400).json({
        success: false,
        message: "failed to delete product" + error.message,
        data: null,
        error: error.message,
      });
    }
  },
  updateProduct: async (req, res) => {
    try {
      // If new images are uploaded, update the galleries array, else keep the existing galleries.
      if (req.files && req.files.length > 0) {
        req.body["galleries"] = req.files.map((file) => ({
          image: file.filename,
        }));
      } else {
        // Don't change galleries if no new files are uploaded, keep existing images

        const existingProduct = await ProductModel.findById(req.params.id);
        req.body["galleries"] = existingProduct.galleries || [];
      }

      const productId = req.params.id;
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        productId,
        req.body,
        { new: true } // This option ensures the updated document is returned
      );
      // Check if the product was updated successfully
      if (!updatedProduct) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "success",
        data: updatedProduct,
      });
    } catch (error) {
      // Log the error to the console for debugging
      console.error("Error deleting order:", error);
      res.status(400).json({
        success: false,
        message: "failed to update product:" + error.message,
        data: null,
      });
    }
  },
};
