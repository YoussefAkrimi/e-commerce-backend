// models/categoryModel.js
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    subCategories: [{ type: mongoose.Types.ObjectId, ref: "SubCategory" }], // Array of subcategory references
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", categorySchema);
