const mongoose = require("mongoose");

const factureSchema = new mongoose.Schema(
  {
    ref: { type: Number, required: true },
    remise: { type: String, required: true },
    description: { type: String, required: true },
    commande: { type: mongoose.Types.ObjectId, ref: "Commande", unique: true }, // Reference to Commande (One-to-One)

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Facture", factureSchema);
