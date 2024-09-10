
import { db } from "../../firebase.js";

/**
 * Retrieves a single product from the Firestore database by its ID.
 * 
 * @param {Object} req - Express request object containing the product ID in params
 * @param {Object} res - Express response object used to send a JSON response
 */
export async function getProductById(req, res) {
    try {
        // Extract the product ID from the request parameters
        const productId = req.params.id;

        // Retrieve a reference to the products collection in Firestore
        const productsRef = db.collection("products");

        // Get the product document from Firestore using its ID
        const doc = await productsRef.doc(productId).get();
        /* const docRef = doc(db, "products", req.params.id);
       const docSnap = await getDoc(docRef); */

        // Check if the document exists in the database
        if (!doc.exists) {
            // Send a 404 response if the product document is not found
            res.status(404).json({ error: "Product not found" });
        } else {
            // Send a 200 response with the product data if found
            res.status(200).json({
                id: doc.id,
                ...doc.data(),
            });
        }
    } catch (error) {
        // Handle errors by logging and sending an appropriate error response
        console.error("Error while retrieving product:", error);
        res.status(500).json({ error: "Error while retrieving product" });
    }
}
