import { db } from "../../firebase.js";

/**
 * Retrieves products from the database that contain specified ingredients in their searchKeywords array.
 * 
 * @param {Object} req - Express request object containing query parameters (searchTerm, limit)
 * @param {Object} res - Express response object used to send a JSON response
 */
export async function getSearchProductsByIngredients(req, res) {
    try {
        // Extract search term and limit from query parameters
        const searchTerm = req.query.searchTerm;
        const limit = parseInt(req.query.limit, 10) || 6;

        // Return a 400 error if searchTerm is missing
        if (!searchTerm) {
            return res.status(400).json({ error: "Missing search term" });
        }

        const products = [];
        const productsRef = db.collection("products");

        // Convert searchTerm to lowercase for case-insensitive matching
        const searchTermLowerCase = searchTerm.toLowerCase();

        // Query products collection to find products containing the searchTerm in their ingredients array
        const querySnapshot = await productsRef
            .orderBy("title")
            .where("ingredients", "array-contains", searchTermLowerCase)
            .limit(limit)
            .get();

        // Return a 404 error if no results are found
        if (querySnapshot.empty) {
            return res.status(404).json({ error: "No results found" });
        }

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
        console.error("Error while searching products:", error);
        res.status(500).json({ error: "Error while searching products", message: error.message });
    }
}

