import { auth } from "../../firebase.js"
import { sendEmail } from "../sendEmail.js";


const actionCodeSettings = {
    url: `${process.env.URL}/login`, // URL where the user will be redirected after password reset completion
    handleCodeInApp: true, // Indicates that the action code link will handle in the app
};

/**
 * Function to handle POST request to generate a password reset link
 * @param {Object} req - HTTP request object containing the email in the body
 * @param {Object} res - HTTP response object to send back a response
 * @returns {Object} JSON response indicating success or failure
 */
export async function postGeneratePasswordResetLink(req, res) {
    const { email } = req.body; // Extract email from request body
    try {

        //Check if the email exists in Firebase Authentication.
        const userRecord = await auth.getUserByEmail(email);

        // Generate password reset link with provided email and action code settings
        const resetLink = await auth.generatePasswordResetLink(email, actionCodeSettings);

        const emailHTML = `
                <html>
                    <body>
                    <p>Hello,</p>
                    <br>
                    <p>Follow this link to reset your Bar Gogh password for your ${email} account.</p>
                    <p>If you didn’t ask to reset your password, you can ignore this email.</p>
                    <br>
                    <a href="${resetLink}">${resetLink}</a> 
                    <br>
                    <p>Thanks,</p>
                    <p>Your Bar Gogh team.</p>
                    </body>
                </html>
                `;

        // Send an email containing the password reset link
        sendEmail(email, "Password reset link", null, emailHTML);
        // Respond with success message
        return res.status(200).json("The password reset link has been sent to your email.");
    } catch (error) {
        console.error('Error sending link:', error);
        //If the user does not exist or if there is another error, respond with an error message.
        if (error.code === 'auth/user-not-found') {
            return res.status(404).json({ error: 'User not found. Please check your email address.' });
        } else {
            return res.status(500).json({ error: 'Error sending password reset link. Please try again later.' });
        }
    }
}

