import { db } from "../../firebase.js";

export async function getStripeCustomerId(req, res) {
    try {
        // Get the authenticated user's data from the authentication middleware
        const { uid } = req.user;

        // Query Firestore to get the user's document corresponding to the UID
        const userDoc = await db.collection('users').doc(uid).get();

        // Check if the user's document exists in the database
        if (!userDoc.exists) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Get the user's data from the document
        const userData = userDoc.data();
        const stripeCustomerId = userData.stripeCustomerId;

        // Check if the stripeCustomerId exists in the user's data
        if (!stripeCustomerId) {
            return res.status(404).json({ success: false, error: 'Stripe Customer ID not found' });
        }

        // Return the user's details as a response
        return res.status(200).json({ success: true, stripeCustomerId });
    } catch (error) {
        console.error('Error getting stripeCustomerId:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}
