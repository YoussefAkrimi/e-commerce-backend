const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  image: String,
});
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ref: { type: Number, required: true, unique: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    qte: { type: Number, required: true },
    galleries: [imageSchema],
    subcategory: {
      type: mongoose.Types.ObjectId,
      ref: "SubCategory",
      required: true, // Make this required to ensure every product is linked to a ONE subcategory
    },
    orders: [{ type: mongoose.Types.ObjectId, ref: "Order" }], // Add an array to store references to orders
    providers: { type: mongoose.Types.ObjectId, ref: "Provider" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
