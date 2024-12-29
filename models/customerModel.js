const mongoose = require("mongoose");
const User = require("./userModel");

const customerSchema = new mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  cin: { type: Number, required: true, unique: true },
  image: { type: String },
  orders: [{ type: mongoose.Types.ObjectId, ref: "Order" }], // Reference to Order model
});

// Create the Customer model from the User model as a discriminator
User.discriminator("Customer", customerSchema);

module.exports = mongoose.model("Customer");
