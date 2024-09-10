import { auth, db } from "../../../firebase.js";

/**
 * Function to update user profile information.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
export async function updateProfile(req, res) {
    try {
        const { uid } = req.user; // Extracts user ID from authenticated user information
        const { email, newPassword, firstName, lastName, fullName } = req.body; // Extracts fields from request body

        // Reference to the user document in Firestore
        const userRef = db.collection('users').doc(uid);

        // Prepare updated data with fields from the request body
        const updatedData = {
            email: email,
            lastName: lastName,
            firstName: firstName,
            fullName: `${firstName} ${lastName}` // Concatenate first name and last name for full name
            // Add other fields to update here
        };

        // Update user profile in Firebase Authentication
        await auth.updateUser(uid, {
            email: email, // Update email
            // password: newPassword, // Uncomment to update password (if needed)
            displayName: fullName // Update display name
        });

        // Update user document in Firestore with merged data
        await userRef.set(updatedData, { merge: true });

        // Return success response
        return res.status(200).json({ success: true });
    } catch (error) {
        // Handle errors and return error response
        res.status(500).json({ error, message: error.message });
    }
}