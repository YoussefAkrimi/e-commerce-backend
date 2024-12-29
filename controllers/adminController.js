const Admin = require("../models/adminModel"); // Import the Admin model
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const generateCode = (length = 16) => {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
};

module.exports = {
  // Create an admin
  createAdmin: async (req, res) => {
    try {
       // Check if an admin with the same email already exists
    const existingAdmin = await Admin.findOne({ email: req.body.email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "An admin with this email already exists.",
      });
    }
      const code = generateCode(8);
      console.log("generated code:", code);
      const admin = new Admin({ ...req.body, code: code });
      await admin.save();

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
        to: admin.email,
        subject: "email verification code",
        text: `Click here to get your code: ${code}`,
        html: `<b> click here to get your code </b> <a href=http://localhost:3000/user/verify-email/${code}>get your code</a>`,
      };
      await transporter.sendMail(mailOptions);

      res.status(200).json({
        success: true,
        message: "admin created successfully",
        data: admin,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "failed to create admin",
        data: null,
        error: error.message,
      });
    }
  },
  // Get all admins
  getAllAdmins: async (req, res) => {
    try {
      const admins = await Admin.find();
      res.status(200).json({
        success: true,
        message: "retrieved all admins successfully",
        data: admins,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "failed to retrieve all admin",
        data: null,
        error: error.message,
      });
    }
  },
  // Get admin by ID
  getAdminById: async (req, res) => {
    try {
      const admin = await Admin.findById(req.params.id);
      res.status(200).json({
        success: true,
        message: "successfully retrieved admin by id",
        data: admin,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "failed to retrieve admin by id",
        data: null,
        error: error.message,
      });
    }
  },

  // Update an admin
  updateAdmin: async (req, res) => {
    try {
      const updatedAdmin = await Admin.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true } // Return the updated document
      );
      res.status(200).json({
        success: true,
        message: "successfully updated admin",
        data: updatedAdmin,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "failed to update admin",
        data: null,
        error: error.message,
      });
    }
  },
  // Delete an admin
  deleteAdmin: async (req, res) => {
    try {
      const admin = await Admin.findByIdAndDelete(req.params.id);
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
          data: null,
        });
      }
      // Add logic to delete or handle any related data if necessary
      // Example: Remove admin reference from users
      await User.updateMany({ admin: req.params.id }, { $unset: { admin: 1 } });

      await Admin.findByIdAndDelete(req.params.id);
      res.status(200).json({
        success: true,
        message: "successfully deleted admin",
        data: admin,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "failed to delete admin",
        data: null,
        error: error.message,
      });
    }
  },
};
