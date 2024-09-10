
import { db } from "../../firebase.js";

/**
 * Retrieves all products from the Firestore database.
 * 
 * @param {Object} _ - Express request object (unused)
 * @param {Object} res - Express response object used to send a JSON response
 */
export async function getProducts(_, res) {
    try {
        console.log("Firestore instance:", db); // Added this log statement
        const products = [];
        const productsRef = db.collection("products");

        // Query products collection and order results by "title"
        const querySnapshot = await productsRef.orderBy("title").get();

        // Iterate through query results and format each product object
        querySnapshot.forEach((doc) => {
            products.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        // Send a JSON response with the retrieved products
        res.status(200).json(products);
    } catch (error) {
        // Handle errors by logging and sending an appropriate error response
        console.error("Error while retrieving products:", error);
        res.status(500).json({ error: "Error while retrieving products" });
    }
}
