const express = require("express");
const orderController = require("../controllers/orderController");
const route = express.Router();
const routeProtection = require("../middleware/authenticateToken");

route.post("/", routeProtection, orderController.createOrder);
route.get("/", routeProtection, orderController.getAllOrders);
route.get("/:id", routeProtection, orderController.getOrderById);
route.delete("/:id", routeProtection, orderController.deleteOrder);
route.put("/:id", routeProtection, orderController.updateOrder);

module.exports = route;
