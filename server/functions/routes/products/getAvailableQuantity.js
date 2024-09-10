import { db } from "../../firebase.js";

export async function getAvailableQuantity(req, res) {
    const productId = req.params.id; // Extract productId from request parameters

    try {
        // Reference to the product document in Firestore
        const productsRef = db.collection("products").doc(productId);

        // Retrieve the document snapshot
        const productSnap = await productsRef.get();

        // Check if the product document exists in the database
        if (productSnap.exists) {
            // Product exists, send back available quantity as JSON response
            res.status(200).json({
                availableQuantity: productSnap.data().availableQuantity,
            });
        } else {
            // Product not found, send 404 error response
            res.status(404).json({ error: "Product not found" });
        }
    } catch (error) {
        // Handle errors that occur during database operation
        console.error("Error while retrieving product quantity:", error);
        res.status(500).json({ error: "Error while retrieving product quantity" });
    }
}
