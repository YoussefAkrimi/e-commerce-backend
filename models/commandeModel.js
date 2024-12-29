const mongoose = require("mongoose");

const commandeSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    etat: { type: String, required: true },
    lieuLivraison: { type: String, required: true },
    typeLivraison: { type: String, required: true },
    deliveryPrice: { type: Number, required: true },
    order: { type: mongoose.Types.ObjectId, ref: "Order" }, // Optional: Reference to Order
    facture: { type: mongoose.Types.ObjectId, ref: "Facture" }, // Reference to Facture (One-to-One)

  },
  { timestamps: true }
);

module.exports = mongoose.model("Commande", commandeSchema);
