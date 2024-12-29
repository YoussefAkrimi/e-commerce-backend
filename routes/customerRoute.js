const express = require("express");
const customerController = require("../controllers/customerController");
const route = express.Router();
const upload = require("../middleware/upload");
const routeProtection = require("../middleware/authenticateToken");

// Define routes for customer operations
route.post("/", upload.single("image"), customerController.createCustomer);
route.get("/", customerController.getAllCustomers);
route.get("/:id", customerController.getCustomerById);
route.put("/:id", customerController.updateCustomer);
route.delete("/:id", customerController.deleteCustomer);
module.exports = route;
