const Stripe = require("stripe");
const stripe = Stripe(
  "sk_test_51QccfrBLtvvVDjHKQP53OLe91QITgvjpQZTyORgEHSOp6FjSo5iuY5HK1rcytiRRM968Cys57pVliyG2xVKI8fit00QvZCxmen"
); // Replace with your actual Stripe secret key

// Controller to handle creating a payment intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body; // Get the amount from the request body

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in the smallest currency unit (e.g., cents)
      currency: "usd", // Set your desired currency
      payment_method_types: ["card"], // Use card payments
    });

    // Send the client secret to the frontend to complete the payment
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Payment failed" });
  }
};
