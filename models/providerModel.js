const mongoose = require("mongoose");
const User = require("./userModel");

const providerSchema = new mongoose.Schema({
  matricule: { type: String, required: true },
  company: { type: String, required: true },
  service: { type: String, required: true },
  products: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
});

// Create Provider as a discriminator of User
User.discriminator("Provider", providerSchema);

module.exports = mongoose.model("Provider");
