// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path"); // to work with file paths
const port = 3000;
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const providerRoute = require("./routes/providerRoute");
const customerRoute = require("./routes/customerRoute");
const commandeRoute = require("./routes/commandeRoute");
const factureRoute = require("./routes/factureRoute");
const orderRoute = require("./routes/orderRoute");

const connectDB = require("./database"); // Make sure database.js is properly set up
connectDB(); // Connect to the database

// Serve static files from the root directory (where correct-email.html and error-email.html are located)
app.use("/verification", express.static(path.join(__dirname, "verification")));
// Serve the 'storage' folder as a static folder
app.use("/storage", express.static(path.join(__dirname, "storage")));

// Set up routes
app.use("/categories", categoryRoute); // Route for categories
app.use("/subCategories", subCategoryRoute); // Route for subcategories
app.use("/product", productRoute);
app.use("/user", userRoute);
app.use("/admin", adminRoute);
app.use("/provider", providerRoute);
app.use("/customer", customerRoute);
app.use("/commande", commandeRoute);
app.use("/facture", factureRoute);
app.use("/order", orderRoute);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
