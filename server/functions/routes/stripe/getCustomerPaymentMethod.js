import { stripe } from "../../firebase.js";

/**
 * Retrieves a specific payment method associated with a customer from Stripe.
 * 
 * @param {Object} req - Express request object containing parameters in URL (stripeCustomerId, paymentMethodId)
 * @param {Object} res - Express response object used to send a JSON response
 */
export async function getCustomerPaymentMethod(req, res) {
    const { stripeCustomerId, paymentMethodId } = req.params;

    try {
        // Retrieve the payment method from Stripe using the provided customer ID and payment method ID
        const paymentMethod = await stripe.customers.retrievePaymentMethod(stripeCustomerId, paymentMethodId);

        // Log the retrieved payment method for debugging purposes
        console.log(paymentMethod);

        // Send a JSON response with the retrieved payment method details
        res.status(200).json(paymentMethod);
    } catch (error) {
        // Handle errors by logging them and sending an appropriate error response
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
