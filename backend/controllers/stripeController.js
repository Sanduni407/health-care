import Stripe from 'stripe';

// TODO: Replace with your Stripe Secret Key
const stripe = new Stripe('sk_test_51SInApFhqyOQhTU7UqffKKrHgAgDWewjf0GBNfVl3ed3EJGPSwWgbIndY4iujQXHk1rfSHThXsFJf8JB1g5gZsAD00VCKcwqr5');

// Create Stripe Checkout Session
export const createCheckoutSession = async (req, res) => {
  try {
    const { appointmentIds, amount, paymentMethod } = req.body;
    const userId = req.user.id;

    if (!appointmentIds || appointmentIds.length === 0) {
      return res.json({ success: false, message: "No appointments selected" });
    }

    console.log('Creating Stripe session for amount:', amount); // Debug

    // For card payments - standard checkout
    if (paymentMethod === 'card') {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Hospital Bill Payment',
                description: `Payment for ${appointmentIds.length} appointment(s)`,
              },
              unit_amount: Math.round(amount * 100), // Amount is already in USD, just convert to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment`,
        metadata: {
          userId: userId.toString(),
          appointmentIds: appointmentIds.join(','),
          paymentType: 'card',
          originalAmount: amount.toString(),
          originalCurrency: 'USD',
        },
      });

      console.log('Stripe session created:', session.id); // Debug

      return res.json({ 
        success: true, 
        sessionId: session.id,
        url: session.url 
      });
    }

    // Default fallback
    return res.json({ success: false, message: 'Invalid payment method' });

  } catch (error) {
    console.error('Stripe error:', error);
    res.json({ success: false, message: error.message });
  }
};

// Verify payment and update database
export const verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // Payment successful - return session details
      res.json({
        success: true,
        session: {
          paymentStatus: session.payment_status,
          amountTotal: session.amount_total / 100,
          currency: session.currency,
          metadata: session.metadata,
          paymentIntent: session.payment_intent,
        }
      });
    } else {
      res.json({ success: false, message: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.json({ success: false, message: error.message });
  }
};

// Webhook to handle Stripe events (for production)
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // TODO: Update your database here
    // - Mark appointments as paid
    // - Create bill record
    console.log('Payment successful for session:', session.id);
  }

  res.json({ received: true });
};