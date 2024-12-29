// models/subCategoryModel.js
const mongoose = require("mongoose");

// Define the subcategory schema
const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // The name field is required
      trim: true, // Remove leading and trailing whitespace
      minlength: [3, "Name must be at least 3 characters long"], // Minimum length validation (optional)
    },
    description: {
      type: String,
      required: true, // The description field is also required
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category", //from here module.exports = mongoose.model("Category", categorySchema);

      required: true, // Make this field required to ensure every subcategory is linked to a category
    
    },
      // Link each product to this subcategory (Array of Product references)
      products: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
  
  },
  {
    timestamps: true,
  }
);

// Create the model from the schema
const subCategoryModel = mongoose.model("SubCategory", subCategorySchema);

// Export the model
module.exports = subCategoryModel;
