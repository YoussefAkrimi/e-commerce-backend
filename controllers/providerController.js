const Provider = require("../models/providerModel");
const Product = require("../models/productModel");
const User = require("../controllers/userController");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const generateCode = (length = 16) => {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
};
module.exports = {
  createProvider: async (req, res) => {
    try {
      const code = generateCode(8);
      console.log("generated code:", code);
      console.log(req.body); // Log incoming data

      const provider = new Provider({ ...req.body, code: code });
      await provider.save();

      // Update the product to include this provider
      await Product.findByIdAndUpdate(req.body.product, {
        $push: { providers: provider._id }, // Add the provider to the product's providers array
      });
      const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io", // Mailtrap SMTP server
        port: 587,
        auth: {
          user: process.env.MAILTRAP_USER, // Mailtrap user (from Mailtrap dashboard)
          pass: process.env.MAILTRAP_PASS, // Mailtrap password (from Mailtrap dashboard)
        },
      });

      const mailOptions = {
        from: '"MyApp" <c4f74bf0e8bf1b@sandbox.mailtrap.io>',
        to: provider.email,
        subject: "email verification code",
        text: `Click here to get your code: ${code}`,
        html: `<b> click here to get your code </b> <a href=http://localhost:3000/user/verify-email/${code}>get your code</a>`,
      };
      await transporter.sendMail(mailOptions);
      res.status(200).json({
        success: true,
        message: "provider created successfully",
        data: provider,
      });
    } catch (error) {
      console.error("Error creating provider:", error); // Log error details for debugging

      res.status(400).json({
        success: false,
        message: "failed to create provider",
        data: null,
        error: error.message,
      });
    }
  },
  getAllProviders: async (req, res) => {
    try {
      const providers = await Provider.find();
      res.status(200).json({
        success: true,
        message: "all providers retrieved successfully",
        data: providers,
      });
    } catch (error) {
      res.status(400).json({
        success: true,
        message: "failed to get all provider",
        data: null,
        error: error.message,
      });
    }
  },
  getProviderById: async (req, res) => {
    try {
      const provider = await Provider.findById(req.params.id).populate(
        "products"
      );
      res.status(200).json({
        success: true,
        message: "successfully got provider by id",
        data: provider,
      });
    } catch (error) {
      res.status(400).json({
        success: true,
        message: "failed to get provider",
        data: null,
        error: error.message,
      });
    }
  },
  updateProvider: async (req, res) => {
    try {
      const updatedProvider = await Provider.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true } // Return the updated document
      );
      res.status(200).json({
        success: true,
        message: "provider updated successfully",
        data: updatedProvider,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "failed to update provider",
        data: null,
        error: error.message,
      });
    }
  },
  deleteProvider: async (req, res) => {
    try {
      const provider = await Provider.findByIdAndDelete(
        req.params.id,
        req.body
      );
      res.status(200).json({
        success: true,
        message: "provider deleted successfully",
        data: provider,
      });
    } catch (error) {
      res.status(400).json({
        success: true,
        message: "failed to delete provider",
        data: null,
        error: error.message,
      });
    }
  },
};
