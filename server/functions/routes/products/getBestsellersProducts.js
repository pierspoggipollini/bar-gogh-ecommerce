import { db } from "../../firebase.js";

/**
 * Retrieves the bestseller products from the Firestore database based on rating.
 * 
 * @param {Object} req - Express request object containing optional 'limit' query parameter
 * @param {Object} res - Express response object used to send a JSON response
 */
export async function getBestsellersProducts(req, res) {
    try {
        const products = [];
        const limit = parseInt(req.query.limit, 10) || 4; // Set default limit to 4 if not specified
        const productsRef = db.collection("products");

        // Query Firestore for bestseller products with rating >= 4.5, ordered by rating in descending order, and limited by 'limit'
        const querySnapshot = await productsRef
            .where("rating", ">=", 4.5)
            .orderBy("rating", "desc")
            .limit(limit)
            .get();

        // Iterate through the query snapshot and build the products array with document data
        querySnapshot.forEach((doc) => {
            products.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        // Send a JSON response with the array of bestseller products
        res.status(200).json(products);
    } catch (error) {
        // Handle errors by logging and sending a 500 internal server error response
        console.error("Error while retrieving bestseller products:", error);
        res.status(500).json({ error: "Error while retrieving bestseller products", message: error.message });
    }
}


