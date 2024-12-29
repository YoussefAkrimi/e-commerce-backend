const express = require("express");
const route = express.Router();
const User = require("../controllers/userController");
const path = require("path");
const routeProtection = require("../middleware/authenticateToken");

// Authentication and user management
route.post("/login", User.login);
route.post("/forgot-password", User.forgetPassword);
route.post("/reset-password/:token", User.resetPassword);
route.put("/update-password/:id",routeProtection, User.updatePassword);
// Search users
route.get("/find-user-by-name-and-email",routeProtection, User.findUserByNameAndEmail);
route.get("/find-user-by-name-or-email",routeProtection, User.findUserByNameOrEmail);

// User registration (with email verification)
route.post("/register", User.register);
// Email verification route (link with verification code)
route.get("/verify-email/:code", User.verifyEmail);
/* route.get("/test-redirect", (req, res) => {
  console.log("Redirecting to example page...");
  res.redirect("http://localhost:3000/correct-email.html");
}); */

module.exports = route;
