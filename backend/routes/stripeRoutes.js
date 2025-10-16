import express from "express";
import { createCheckoutSession, verifyPayment, stripeWebhook } from "../controllers/stripeController.js";
import { userAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create Stripe checkout session
router.post("/create-checkout-session", userAuth, createCheckoutSession);

// Verify payment after redirect
router.post("/verify-payment", userAuth, verifyPayment);

// Webhook endpoint (no auth - Stripe verifies via signature)
router.post("/webhook", express.raw({ type: 'application/json' }), stripeWebhook);

export default router;