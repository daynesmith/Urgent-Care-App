const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_KEY); // put in .env

router.post('/create-checkout-session', async (req, res) => {
  const { amount, billingId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Bill #${billingId}`,
          },
          unit_amount: amount * 100, // amount in cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.URL_FOR_STRIPE}/payment-success/${billingId}`,
      cancel_url: `${process.env.URL_FOR_STRIPE}/payment-cancelled`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;