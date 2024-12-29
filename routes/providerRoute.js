const express = require("express");
const providerController = require("../controllers/providerController");
const route = express.Router();
const routeProtection = require("../middleware/authenticateToken");

route.post("/", providerController.createProvider);
route.get("/",  providerController.getAllProviders);
route.get("/:id", routeProtection, providerController.getProviderById);
route.delete("/:id", routeProtection, providerController.deleteProvider);
route.put("/:id", routeProtection, providerController.updateProvider);
module.exports = route;
