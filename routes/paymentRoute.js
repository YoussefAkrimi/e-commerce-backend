const express = require('express');
const route = express.Router();
const paymentController = require('../controllers/paymentController');  // Import the controller

// Define the route to create a payment intent
route.post('/create-payment-intent', paymentController.createPaymentIntent);

module.exports = route;
