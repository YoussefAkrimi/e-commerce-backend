const mongoose = require("mongoose");
const User = require("./userModel"); // Import the base User model

const adminSchema = new mongoose.Schema({
  // Add any admin-specific fields here if needed
});
//youssef
// Create the Admin model as a discriminator of the User model
User.discriminator("Admin", adminSchema);
module.exports = mongoose.model("Admin");
