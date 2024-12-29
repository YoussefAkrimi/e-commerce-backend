const express = require("express");
const route = express.Router();
const commandeController = require("../controllers/commandeController");
const routeProtection = require("../middleware/authenticateToken");

route.post("/", commandeController.createCommande);
route.get("/", commandeController.getAllCommandes);
route.get("/:id", commandeController.getCommandeById);
route.delete("/:id", commandeController.deleteCommande);
route.put("/:id", commandeController.updateCommande);

module.exports = route;
