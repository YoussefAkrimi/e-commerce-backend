const CommandeModel = require("../models/commandeModel");
const OrderModel = require("../models/orderModel");
module.exports = {
  
  createCommande: async (req, res) => {
    try {
      // Create the new Commande
      const commande = new CommandeModel(req.body);
      await commande.save();

      //For one-to-one relationships: Use $set to directly assign the reference.
      //For one-to-many relationships (if each Commande could be linked to multiple Orders): You would use $push to add the Commande reference to an array of orders.

      // Update the corresponding order with the commande reference
      await OrderModel.findByIdAndUpdate(
        req.body.order, // Order ID from the request body
        { $set: { commande: commande._id } } // Set the commande reference
      );

      res.status(200).json({
        success: true,
        message: "commande created successfully",
        data: commande,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "failed to create commande",
        data: null,
        error: error.message,
      });
    }
  },
  getAllCommandes: async (req, res) => {
    try {
      const commandes = await CommandeModel.find();
      res.status(200).json({
        success: true,
        message: "successfully retrieved  all commandes",
        data: commandes,
      });
    } catch (error) {
      // Log the error to the console for debugging
      console.error("Error retrieving commandes:", error);

      res.status(400).json({
        success: false,
        message: "failed to retrieve all commandes",
        data: null,
        error: error.message,
      });
    }
  },

  getCommandeById: async (req, res) => {
    try {
      const commande = await CommandeModel.findById(req.params.id)
        .populate("order") //populate the order reference
        .populate("facture");// Populating the facture reference
      res.status(200).json({
        success: true,
        message: "successfully retrieved commande by id",
        data: commande,
      });
    } catch (error) {
      // Log the error to the console for debugging
      console.error("Error retrieving commande by id:", error);

      res.status(400).json({
        success: false,
        message: "failed to retrieve  commandes",
        data: null,
        error: error.message,
      });
    }
  },

  deleteCommande: async (req, res) => {
    try {
      const commande = await CommandeModel.findByIdAndDelete(req.params.id);
      res.status(200).json({
        success: true,
        message: "successfully deleted commande",
        data: commande,
      });
    } catch (error) {
      // Log the error to the console for debugging
      console.error("Error deleting commandes:", error);

      res.status(400).json({
        success: false,
        message: "failed to delete  commandes",
        data: null,
        error: error.message,
      });
    }
  },

  updateCommande: async (req, res) => {
    try {
      const updatedCommande = await CommandeModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true } // Return the updated document
      );
      res.status(200).json({
        success: true,
        message: "successfully updated Commande",
        data: updatedCommande,
      });
    } catch (error) {
      // Log the error to the console for debugging
      console.error("Error updating commandes:", error);

      res.status(400).json({
        success: false,
        message: "failed to update  commandes",
        data: null,
        error: error.message,
      });
    }
  },
};
