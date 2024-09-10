import { db } from "../../firebase.js";


export async function getUser(req, res) {
    try {
        // Get authenticated user data from the authentication middleware
        const { uid } = req.user;

        // Query Firestore database to retrieve the user document corresponding to the UID
        const userDoc = await db.collection('users').doc(uid).get();

        // Check if the user document exists in the database
        if (!userDoc.exists) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Extract user data from the document
        const userData = userDoc.data();

        // Create fullName and add it to the userData object
        const { firstName, lastName } = userData;
        const fullName = `${firstName} ${lastName}`;
        userData.fullName = fullName;

        // Return user details as a response
        return res.status(200).json({ success: true, user: { userData } });
    } catch (error) {
        console.error('Error getting user details:', error);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
}
