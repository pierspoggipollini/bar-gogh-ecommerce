import { db } from "../../firebase.js";
import { FieldValue } from "firebase-admin/firestore";
import { sendEmail } from "../sendEmail.js";

/**
 * Endpoint to handle the contact form submission.
 * Saves the message to Firestore and sends a confirmation email.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
export async function postContact(req, res) {
    const { firstName, lastName, email, message } = req.body;

    try {
        // Save the message to Firestore
        await db.collection('contacts').add({
            firstName,
            lastName,
            email,
            message,
            status: "pending",
            timestamp: FieldValue.serverTimestamp()
        });

        // Define the subject and content of the email
        const subject = 'Receipt Confirmation';
        const text = 'Thank you for your message. We have received your email and will respond shortly.';
        const html = `
            <p>Thank you for your message.</p>
            <p>We have received your email and will respond shortly.</p>
        `;

        // Send the email with the specified subject and content
        sendEmail(email, subject, text, html);

        // Send success response
        res.status(201).send('Message sent successfully');

    } catch (error) {
        console.error("Error sending message: ", error);
        res.status(500).json({ error: "Error sending message" });
    }
}
