import { db } from "../../firebase.js";

// Function to fetch products from the database
export async function getSearchProducts(req, res) {
    try {
        const searchTerm = req.query.searchTerm;
        const filter = req.query.filter || "name"; // Default filter is "name"
        const limit = parseInt(req.query.limit, 10) || 6;

        if (!searchTerm) {
            return res.status(400).json({ error: "Missing search term" });
        }

        const products = [];
        const productsRef = db.collection("products");

        // Convert the search term to lowercase for case-insensitive matching
        const searchTermLowerCase = searchTerm.toLowerCase();

        let query;
        if (filter === "ingredients") {
            // Search by ingredients
            query = productsRef
                .orderBy("title")
                .where("ingredients", "array-contains", searchTermLowerCase)
                .limit(limit);
        } else {
            // Default search by name
            query = productsRef
                .orderBy("title")
                .where("searchKeywords", "array-contains", searchTermLowerCase)
                .limit(limit);
        }

        const querySnapshot = await query.get();

        if (querySnapshot.empty) {
            return res.status(404).json({ error: "No results found" });
        }

        querySnapshot.forEach((doc) => {
            products.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        res.status(200).json(products);
    } catch (error) {
        console.error("Error while searching products:", error);
        res.status(500).json({ error: "Error while searching products", message: error.message });
    }
}
