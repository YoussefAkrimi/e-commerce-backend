const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const accessKey = process.env.Rtoken;
const refreshKey = process.env.Ftoken;
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { join } = require("path");
/* const join = require('')
 */
// Initialize the Mailtrap transporter
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io", // Mailtrap SMTP server
  port: 587,
  auth: {
    user: process.env.MAILTRAP_USER, // Mailtrap user (from Mailtrap dashboard)
    pass: process.env.MAILTRAP_PASS, // Mailtrap password (from Mailtrap dashboard)
  },
});

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
    },
    accessKey,
    { expiresIn: "30m" }
  );
};

const generaterefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
    },
    refreshKey,
    { expiresIn: "1h" }
  );
};
let refreshTokens = [];

module.exports = {
  // User registration with email verification
  register: async (req, res) => {
    try {
      const { fullName, email, password, phone } = req.body;
      // Check if the email is already in use
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({
          messagae: "email is already registered",
        });
      }
      // Create a new user with a unique verification code
      const verificationCode = crypto.randomBytes(16).toString("hex");
      const newUser = new User({
        fullName,
        email,
        password,
        phone,
        code: verificationCode,
      });
      //save the new user
      await newUser.save();

      //send verification email
      const verificationLink = `${process.env.FRONTEND_URL}/user/verify-email/${verificationCode}`;
      const mailOptions = {
        from: '"MyApp" <c4f74bf0e8bf1b@sandbox.mailtrap.io>',
        to: newUser.email,
        subject: "Email Verification",
        html: `<b>Please verify your email by clicking the link:</b> <a href="${verificationLink}">Verify Email</a>`,
      };
      await transporter.sendMail(mailOptions);
      res.status(201).json({
        success: true,
        message: "User registered successfully. Please verify your email",
      });
    } catch (error) {
      console.error("Error during registration", error);
      res.status(500).json({
        success: false,
        message: "registration failed",
      });
    }
  },
  // Email verification
  verifyEmail: async (req, res) => {
    try {
      const { code } = req.params;
      console.log(`Received verification code: ${code}`);

      // Find the user by the verification code
      const user = await User.findOne({ code });
      if (!user) {
        console.log("Invalid or expired code");
        return res.sendFile(
          join(__dirname + "../../verification/failed-verification.html")
        ); // Redirect to failed verification page
      }

      // Check if the user's email is already verified
      /*  if (user.verify) {
        console.log("Email already verified");
        return res.redirect("/verification/successful-verification.html"); // Redirect to successful verification page
      } */
      // Log the password before making any changes
      console.log("Password before updating verification:", user.password);
      // Mark the user's email as verified and clear the verification code
      user.verify = true;
      user.code = null; // Clear the verification code after successful verification
      await user.save();
      // Log the password after save
      console.log("Password after updating verification:", user.password);
      console.log("Email successfully verified");

      // Redirect to the successful verification page
      return res.sendFile(
        join(__dirname + "../../verification/successful-verification.html")
      );
    } catch (error) {
      console.error(error);
      // In case of error, redirect to failed verification page
      return res.redirect("/verification/failed-verification.html");
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          message: "User not found",
        });
      }
      if (!user.verify) {
        return res.status(400).json({
          success: false,
          message: "user is not verified",
        });
      }
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({
          message: " Wrong password",
        });
      }
      const accessToken = generateAccessToken(user);
      const refreshToken = generaterefreshToken(user);
      refreshTokens.push(refreshToken);
      return res.status(200).json({
        success: true,
        message: " email and password correct, Login successful!",
        data: user,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } catch (error) {
      console.log(error.message); // Log the error for debugging
      return res.status(400).json({
        success: false,
        message: "failed to login",
        data: null,
      });
    }
  },

  forgetPassword: async (req, res) => {
    try {
      const { email } = req.body;

      // Check if email exists in the database
      const DoesEmailExist = await User.findOne({ email });
      if (!DoesEmailExist) {
        return res.status(400).json({
          message: "email not found",
        });
      }

      // Generate a token for password reset (valid for 5 minutes)
      const resetToken = jwt.sign(
        { id: DoesEmailExist.id },
        refreshKey, // use refresh key for reset tokens
        { expiresIn: "10m" } // expires in 5 minutes
      );

      // Create the reset link (frontend URL for password reset page)
      const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

      // Define the email options (to be sent to the user)
      const mailOptions = {
        from: '"MyApp" <c4f74bf0e8bf1b@sandbox.mailtrap.io>', // Sender address
        to: DoesEmailExist.email, // Recipient address
        subject: "Password Reset Request", // Subject line
        text: `Click here to reset your password: ${resetLink}`, // Plain text body (can be HTML if preferred)
        html: `<b>Click here to reset your password</b> <a href=${resetLink}> Click Here</a> `,
      };

      // Send the email using Mailtrap
      await transporter.sendMail(mailOptions);

      // Respond to the client indicating that the email was sent
      res.status(200).json({
        success: true,
        message: "Password reset email sent successfully.",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to send password reset email.",
        error: error.message,
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { newPassword } = req.body;

      // Verify the token
      const decoded = jwt.verify(req.params.token, refreshKey); // Use your reset key
      const userId = decoded.id;

      // Find the user by ID and update the password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.findByIdAndUpdate(userId, { password: hashedPassword });

      res.status(200).json({
        success: true,
        message: "Password has been reset successfully.",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired token.",
        error: error.message,
      });
    }
  },

  updatePassword: async (req, res) => {
    try {
      const userId = req.params.id;
      const { currentPassword, newPassword } = req.body;
      // Validate input
      if (!currentPassword || !newPassword) {
        return res
          .status(400)
          .json({ message: "Both current and new passwords are required." });
      }

      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Check if the old password matches the stored password
      const isMAtch = await bcrypt.compare(currentPassword, user.password);
      if (!isMAtch) {
        return res.status(400).json({ message: "Old password is not correct" });
      }

      user.password = newPassword;
      // Save the updated user
      await user.save();

      res.status(200).json({
        message: " password updated successfully",
      });
    } catch (error) {
      res.status(400).json({
        message: "failed to update password" + error,
      });
    }
  },
  findUserByNameOrEmail: async (req, res) => {
    try {
      const user = await User.findOne({
        $or: [{ email: req.query.email }, { fullName: req.query.fullName }],
      });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          data: null,
        });
      }
      res.status(200).json({
        success: true,
        message: "successfully retrieved user",
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Error retrieving user: " + error.message,
        data: null,
      });
    }
  },
  findUserByNameAndEmail: async (req, res) => {
    try {
      const user = await User.findOne({
        $and: [{ email: req.query.email }, { fullName: req.query.fullName }],
      });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          data: null,
        });
      }
      res.status(200).json({
        success: true,
        message: "successfully retrieved user",
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Error retrieving user: " + error.message,
        data: null,
      });
    }
  },
};
