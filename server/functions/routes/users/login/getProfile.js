/* eslint-disable no-useless-catch */
import { auth, db } from "../../../firebase.js";

// Function to retrieve user data from the database
export async function getUserDataFromDatabase(uid) {
    try {
        // Get user details from Firebase Authentication
        const user = await auth.getUser(uid);

        // Query Firestore database to get the user document corresponding to the UID
        const userDoc = await db.collection('users').doc(uid).get();
        // Get user data from the document
        const userDocData = userDoc.data();

        // Call your function to retrieve the Stripe Customer ID
        const stripeCustomerId = await userDocData.stripeCustomerId;

        // Create the fullName and add it to the userData object
        const { firstName, lastName } = userDocData;
        const fullName = `${firstName} ${lastName}`;
        // Construct a user data object with desired fields
        const userData = {
            uid: user.uid,
            email: user.email,
            firstName: firstName,
            lastName: lastName,
            fullName: fullName,
            displayName: user.displayName,
            phoneNumber: user.phoneNumber,
            emailVerified: user.emailVerified,
            disabled: user.disabled,
            stripeCustomerId: stripeCustomerId || null
            // Add other user fields you want to retrieve
        };

        return {
            user: userData
        };
    } catch (error) {
        // Handle any errors that occur during user data retrieval
        throw error;
    }
}


// Endpoint to get user profile
export async function getProfile(req, res) {
    try {
        // Get the session cookie from the request
        //const sessionCookie = req.cookies.session.toString() || '';

        // Enable checking for session revocation
        //let checkRevoked = true;

        // Verify the session cookie using Firebase Authentication
        //const decodedClaims = await auth.verifySessionCookie(sessionCookie, checkRevoked);

        // Retrieve user data from the database using the decoded user ID
        const userDataObject = await getUserDataFromDatabase(req.user.uid);
        const { user } = userDataObject;

        // Return success response with user data
        return res.status(200).json({ success: true, user });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error(error);
        return res.status(500).json({ success: false, error: 'Internal server error', message: error.message });
    }
}
