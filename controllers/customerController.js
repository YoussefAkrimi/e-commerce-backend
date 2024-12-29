  const Customer = require("../models/customerModel");
  const User = require("./userController"); // Import userController for shared methods
  const crypto = require("crypto");
  const nodemailer = require("nodemailer");

  const generateCode = (length = 16) => {
    return crypto.randomBytes(length).toString("hex").slice(0, length);
  };
  module.exports = {
    // Create a new customer
    createCustomer: async (req, res) => {
      try {
        const code = generateCode(8);
        console.log("generated code:", code);
        req.body.image = req.file.filename;


        const customer = new Customer({...req.body, code: code} ); // Assuming req.body contains customer data
        // Debugging the customer model
        console.log("Model name: ", customer.constructor.modelName); // Should log "Customer"

        await customer.save();
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
          to: customer.email,
          subject: "email verification code",
          text: `Click here to get your code: ${code}`,
          html: `<b> click here to get your code </b> <a href=http://localhost:3000/user/verify-email/${code}>get your code</a>`,
        };
        await transporter.sendMail(mailOptions);

        res.status(200).json({
          success: true,
          message: "customer created successfully",
          data: customer,
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: "failed to create customer",
          error: error.message,
          data: null,
        });
      }
    },
    // Get all customers
    getAllCustomers: async (req, res) => {
      try {
        const customers = await Customer.find();
        res.status(200).json({
          success: true,
          message: "customers list retrieved successfully",
          data: customers,
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: "failed to retrieve customers list",
          error: error.message,
          data: null,
        });
      }
    },
    // Get a single customer by ID
    getCustomerById: async (req, res) => {
      try {
        const customer = await Customer.findById(req.params.id).populate(
          "orders"
        );
        res.status(200).json({
          success: true,
          message: "customer retrieved successfully",
          data: customer,
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: "failed to retrieve customer",
          error: error.message,
          data: null,
        });
      }
    },
    // Update a customer
    updateCustomer: async (req, res) => {
      try {
        const updatedCustomer = await Customer.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true } // Return the updated document
        );
        res.status(200).json({
          success: true,
          message: " customer updated successfully",
          data: updatedCustomer,
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: "failed to update customer",
          error: error.message,
          data: null,
        });
      }
    },
    // Delete a customer
    deleteCustomer: async (req, res) => {
      try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        res.status(200).json({
          success: true,
          message: "customer deleted successfully",
          data: customer,
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: "failed to delete customer",
          error: error.message,
          data: null,
          error: error.message,
        });
      }
    },
  };
