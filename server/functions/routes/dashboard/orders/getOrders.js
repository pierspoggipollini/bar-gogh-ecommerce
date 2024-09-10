import { db } from "../../../firebase.js";

/**
 * Function to fetch all orders associated with the authenticated user.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
export async function getOrders(req, res) {
    try {
        const { uid } = req.user; // Extracts user ID from authenticated user information
        const userRef = db.collection('users').doc(uid); // Reference to the user document in Firestore

        // Query Firestore to get the collection of orders for the user
        const ordersQuerySnapshot = await userRef.collection("orders").get();

        // Check if there are no documents in the collection
        if (ordersQuerySnapshot.empty) {
            return res.status(404).json({ success: false, error: "Oops! It seems that you don't have orders" });
        }

        // Extract order data and add ID as a property to each order data object
        const ordersData = ordersQuerySnapshot.docs.map((doc) => {
            const data = doc.data();
            data.id = doc.id; // Add document ID as a property
            return data;
        });

        // Return success response with order data
        return res.status(200).json({ success: true, orders: ordersData });

    } catch (error) {
        console.error('Error getting orders:', error);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
}
