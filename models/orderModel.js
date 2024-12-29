const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    qte: { type: Number, required: true },
    price: { type: Number, required: true },
    products: [{ type: mongoose.Types.ObjectId, ref: "Product" }], // Array of product references
    customer: { type: mongoose.Types.ObjectId, ref: "Customer" },
    commande: { type: mongoose.Types.ObjectId, ref: "Commande" },  // Reference to Commande

  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
