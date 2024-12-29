const OrderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const Customer = require("../models/customerModel");
const CommandeModel = require("../models/commandeModel");
const orderModel = require("../models/orderModel");

module.exports = {
  createOrder: async (req, res) => {
    try {
      const order = new OrderModel(req.body);

      await order.save();

      // Link the order to the products
      await productModel.updateMany(
        { _id: { $in: req.body.products } }, // Find products using the provided product IDs
        { $push: { orders: order._id } } // Link this order to the products
      );
      // Update the customer to include this new order
      await Customer.findByIdAndUpdate(order.customer, {
        $push: { orders: order._id }, // Push the order ID to the customer's orders array
      });

      res.status(200).json({
        success: true,
        message: "order created successfully",
        data: order,
      });
    } catch (error) {
      // Log the error to the console for debugging
      console.error("Error creating order:", error);
      res.status(400).json({
        success: false,
        message: "failed to create order",
        data: null,
        error: error.message,
      });
    }
  },
  getAllOrders: async (req, res) => {
    try {
      const orders = await OrderModel.find();
      res.status(200).json({
        success: true,
        message: "successfully retrieved all orders",
        data: orders,
      });
    } catch (error) {
      // Log the error to the console for debugging
      console.error("Error retrieving all orders:", error);
      res.status(400).json({
        success: false,
        message: "failed to retrieve all orders",
        data: null,
        error: error.message,
      });
    }
  },
  getOrderById: async (req, res) => {
    try {
      const order = await OrderModel.findById(req.params.id)
        .populate("products")
        .populate("customer")
        .populate("commande");
      res.status(200).json({
        success: true,
        message: "successfully retrieved order by id",
        data: order,
      });
    } catch (error) {
      // Log the error to the console for debugging
      console.error("Error retrieving order by id:", error);
      res.status(400).json({
        success: false,
        message: "failed to retrieve order by id",
        data: null,
        error: error.message,
      });
    }
  },
  deleteOrder: async (req, res) => {
    try {
      const orderId = req.params.id;
      // Find and delete the order
      const order = await OrderModel.findByIdAndDelete(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
          data: null,
        });
      }
      // Remove the order from the customer's orders array
      await Customer.updateOne(
        { _id: order.customer }, // Find the customer by order's customer ID
        { $pull: { orders: orderId } } // Pull (remove) the order ID from the orders array
      );
      // Optionally, remove the order reference from products (if needed)
      await productModel.updateMany(
        { _id: { $in: order.products } }, // Find all products associated with this order
        { $pull: { orders: orderId } } // Pull (remove) the order ID from each product's orders array
      );

      res.status(200).json({
        success: true,
        message: "successfully deleted order",
        data: order,
      });
    } catch (error) {
      // Log the error to the console for debugging
      console.error("Error deleting order:", error);
      res.status(400).json({
        success: false,
        message: "failed to delete order",
        data: null,
        error: error.message,
      });
    }
  },
  updateOrder: async (req, res) => {
    try {
      const updatedOrder = await OrderModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      // this to check if there is no order with that id , then return error 'order not found
      if (!updatedOrder) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
          data: null,
        });
      }
      res.status(200).json({
        success: true,
        message: "successfully updated order",
        data: updatedOrder,
      });
    } catch (error) {
      // Log the error to the console for debugging
      console.error("Error updating order:", error);
      res.status(400).json({
        success: false,
        message: "failed to update order",
        data: null,
        error: error.message,
      });
    }
  },
};
