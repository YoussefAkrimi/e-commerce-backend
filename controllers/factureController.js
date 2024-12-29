const FactureModel = require("../models/factureModel");
const CommandeModel = require("../models/commandeModel"); // Import CommandeModel

module.exports = {
  createFacture: async (req, res) => {
    try {
      // Create the new Facture
      const facture = new FactureModel(req.body);
      // Save the facture first
      await facture.save();

      // Now update the corresponding Commande with the Facture reference
      await CommandeModel.findByIdAndUpdate(req.body.commande, {
        $set: { facture: facture._id }, // Set the facture reference in Commande
      });

      res.status(200).json({
        success: true,
        message: "facture created successfully",
        data: facture,
      });
    } catch (error) {
      // Log the error to the console for debugging
      console.error("Error creating facture:", error);
      res.status(400).json({
        success: false,
        message: "failed to create facture",
        data: null,
        error: error.message,
      });
    }
  },
  getAllFacture: async (req, res) => {
    try {
      const factures = await FactureModel.find();
      res.status(200).json({
        success: true,
        message: " successfully retrieved all factures",
        data: factures,
      });
    } catch (error) {
      // Log the error to the console for debugging
      console.error("Error retrieving all factures:", error);
      res.status(400).json({
        success: false,
        message: "failed to retrieve all factures",
        data: null,
        error: error.message,
      });
    }
  },
  getFactureById: async (req, res) => {
    try {
      const facture = await FactureModel.findById(req.params.id).populate(
        "commande"
      );
      res.status(200).json({
        success: true,
        message: "successfully retrieved facture by id",
        date: facture,
      });
    } catch (error) {
      // Log the error to the console for debugging
      console.error("Error retrieving facture by id:", error);
      res.status(400).json({
        success: false,
        message: "failed to retrieving facture by id",
        data: null,
        error: error.message,
      });
    }
  },
  deleteFacture: async (req, res) => {
    try {
      // Step 1: Find and delete the facture
      const facture = await FactureModel.findByIdAndDelete(req.params.id);
      if (!facture) {
        return res.status(404).json({
          success: false,
          message: "Facture not found",
        });
      }
      // Step 2: Remove the facture reference from the linked commande
      await CommandeModel.findOneAndUpdate(
        { facture: req.params.id }, // Find the commande where the facture reference matches
        { $unset: { facture: 1 } }, // Remove the facture reference
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: "successfully deleted facture",
        data: facture,
      });
    } catch (error) {
      // Log the error to the console for debugging
      console.error("Error delete facture:", error);
      res.status(400).json({
        success: false,
        message: "failed to delete facture",
        data: null,
        error: error.message,
      });
    }
  },
  updateFacture: async (req, res) => {
    try {
      const updatdFacture = await FactureModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: "succcessfully updated facture",
        data: updatdFacture,
      });
    } catch (error) {
      // Log the error to the console for debugging
      console.error("Error updating facture:", error);
      res.status(400).json({
        success: false,
        message: "failed to update facture",
        data: null,
        error: error.message,
      });
    }
  },
};
