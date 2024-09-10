import { db } from "../../../firebase.js";

/**
 * Function to fetch a specific credit card by its ID.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
export async function getCreditCardById(req, res) {
    try {
        const id = req.params.id; // Extracts credit card ID from request parameters
        const { uid } = req.user; // Extracts user ID from authenticated user information
        const userRef = db.collection('users').doc(uid); // Reference to the user document in Firestore

        // Query Firestore to get the specific credit card document by its ID
        const creditCardDoc = await userRef.collection("creditCards").doc(id).get();

        // Check if the document exists
        if (!creditCardDoc.exists) {
            return res.status(404).json({ error: 'Credit card not found' });
        }

        // Extract credit card data and add ID as a property to the data object
        const creditCardData = creditCardDoc.data();
        creditCardData.id = creditCardDoc.id; // Add document ID as a property

        // Return success response with credit card data
        return res.status(200).json(creditCardData);

    } catch (error) {
        console.error('Error getting credit card details:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}
