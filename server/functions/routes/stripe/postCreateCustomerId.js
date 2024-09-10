import { stripe } from "../../firebase.js";
/**
 * POST endpoint to create a new customer in Stripe.
 * @param {Object} req - Express request object containing body data with name and email.
 * @param {Object} res - Express response object to send created customer data or error.
 */
export async function postCreateCustomerId(req, res) {
    try {
        const { name, email } = req.body;

        // Create a new customer in Stripe with provided name and email
        const customer = await stripe.customers.create({
            name: name,
            email: email,
        });

        // Respond with the created customer data
        res.status(200).json({ customer });
        console.log(customer); // Log customer details for debugging purposes
    } catch (error) {
        console.error('Error creating customer:', error);
        // Respond with an error message if customer creation fails
        res.status(500).json({ error: "Error creating customer." });
    }
}
