import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../firebase.js";

/**
 * Handles the POST request to save newsletter subscribers' email addresses to Firestore.
 * Checks if the email already exists in the 'emails' collection and adds it if not.
 * 
 * @param {Object} req - Express request object containing email in the request body
 * @param {Object} res - Express response object used to send a JSON response
 */
export async function postNewsletter(req, res) {
    const { email } = req.body; // Extract email from request body
    const userEmailRef = db.collection("emails"); // Reference to the 'emails' collection in Firestore

    // Check if the email already exists in the database
    const querySnapshot = await userEmailRef.where("email", "==", email).get();

    if (!querySnapshot.empty) {
        // If email exists, send a 400 Bad Request response indicating it's already registered
        res.status(400).send("This email is already registered.");
        return;
    }

    try {
        // Add the email to the 'emails' collection with a server timestamp
        const docRef = await userEmailRef.add({
            email: email,
            timestamp: FieldValue.serverTimestamp()
        });

        // Log confirmation message with the document ID where the email was saved
        console.log("Email saved to database with ID: ", docRef.id);

        // Send a 200 OK response with a success message
        res.status(200).json({ message: "Email saved successfully" });
    } catch (error) {
        // Handle errors by logging and sending a 500 Internal Server Error response
        console.error("Error saving email: ", error);
        res.status(500).json({ error: "Error saving email" });
    }
}
