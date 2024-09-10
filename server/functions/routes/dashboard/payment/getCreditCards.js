import { db } from "../../../firebase.js";

/**
 * Function to fetch credit cards associated with the authenticated user.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
export async function getCreditCards(req, res) {
    try {
        const { uid } = req.user; // Extracts user ID from authenticated user information
        const userRef = db.collection('users').doc(uid); // Reference to the user document in Firestore

        // Query Firestore to get the user's credit cards collection
        const creditCardsQuerySnapshot = await userRef.collection("creditCards").get();

        // Check if there are no documents in the collection
        if (creditCardsQuerySnapshot.empty) {
            return res.status(404).json({ success: false, error: 'Credit cards not found' });
        }

        // Extract credit card data and add ID as a property to each data object
        const creditCardsData = creditCardsQuerySnapshot.docs.map((doc) => {
            const data = doc.data();
            data.id = doc.id; // Add document ID as a property
            return data;
        });

        // Return success response with credit card data
        return res.status(200).json({ success: true, creditCards: creditCardsData });

    } catch (error) {
        console.error('Error getting credit card details:', error);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
}
