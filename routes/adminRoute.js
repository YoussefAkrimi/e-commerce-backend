const express = require("express");
const adminController = require("../controllers/adminController");
const route = express.Router();
const routeProtection = require("../middleware/authenticateToken");

route.post("/", adminController.createAdmin);
route.get("/", adminController.getAllAdmins);
route.get("/:id", adminController.getAdminById);
route.delete("/:id", adminController.deleteAdmin);
route.put("/:id", adminController.updateAdmin);

route.get("/:id/profile", routeProtection, adminController.getAdminById); // Protected route to get the admin profile

module.exports = route;
