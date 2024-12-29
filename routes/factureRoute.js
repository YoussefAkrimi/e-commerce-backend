const express = require("express");
const factureController = require("../controllers/factureController");
const route = express.Router();
const routeProtection = require("../middleware/authenticateToken");

route.post("/",routeProtection, factureController.createFacture);
route.get("/",routeProtection, factureController.getAllFacture);
route.get("/:id",routeProtection, factureController.getFactureById);
route.delete("/:id",routeProtection, factureController.deleteFacture);
route.put("/:id",routeProtection, factureController.updateFacture);
module.exports = route;
