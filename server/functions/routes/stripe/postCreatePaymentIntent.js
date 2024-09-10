import { stripe } from "../../firebase.js";

/**
 * POST endpoint to create a payment intent using Stripe.
 * @param {Object} req - Express request object containing body data with customerId, amount, currency, and orderId.
 * @param {Object} res - Express response object to send clientSecret or error.
 */
export async function postCreatePaymentIntent(req, res) {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            customer: req.body.customerId,
            setup_future_usage: 'off_session',
            amount: req.body.amount,
            currency: req.body.currency,
            metadata: {
                order_id: req.body.orderId, // Include orderId in metadata
            },
        });
        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
