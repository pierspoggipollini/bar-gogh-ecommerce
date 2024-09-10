import { db } from "../../firebase.js";

/**
 * Retrieves the latest products from the Firestore database based on timestamp.
 * 
 * @param {Object} req - Express request object containing optional 'limit' query parameter
 * @param {Object} res - Express response object used to send a JSON response
 */
export async function getLatestsProducts(req, res) {
    try {
        const products = [];
        const limit = parseInt(req.query.limit, 10) || 4; // Set default limit to 4 if not specified
        const productsRef = db.collection("products");

        // Query Firestore for latest products, ordered by timestamp in descending order, and limited by 'limit'
        const querySnapshot = await productsRef
            .orderBy("timestamp", "desc")
            .limit(limit)
            .get();

        // Iterate through the query snapshot and build the products array with document data
        querySnapshot.forEach((doc) => {
            products.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        // Send a JSON response with the array of latest products
        res.status(200).json(products);
    } catch (error) {
        // Handle errors by logging and sending a 500 internal server error response
        console.error("Error retrieving latest products:", error);
        res.status(500).json({ error: "Error retrieving latest products" });
    }
}
