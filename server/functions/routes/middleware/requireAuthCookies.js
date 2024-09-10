import { auth } from "../../firebase.js";
import { getUserDataFromDatabase } from "../users/login/getProfile.js";

// Function to retrieve user data
async function verifyAuthenticationCookies(req) {
    try {
        // Perform logic to retrieve authenticated user data
        const sessionCookie = req.cookies.session.toString() || '';
        let checkRevoked = true;
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, checkRevoked);
        const userDataObject = await getUserDataFromDatabase(decodedClaims.uid);
        const { user } = userDataObject;

        // Return user data
        return { success: true, user };
    } catch (error) {
        // Handle errors that may occur while retrieving user data
        console.error(error);
        throw error;
    }
}

// Middleware to verify authentication before accessing user information
export async function requireAuthCookies(req, res, next) {
    try {
        // Perform authentication verification
        const { success, user } = await verifyAuthenticationCookies(req);
        if (success) {
            // If user is authenticated, proceed with the next request
            req.user = user;
            next();
        } else {
            // If user is not authenticated, return unauthorized error
            return res.status(401).json({ success: false, error: 'Unauthorized', message: 'User is not authenticated' });
        }
    } catch (error) {
        // Handle errors that may occur during authentication verification
        console.error(error);
        return res.status(500).json({ success: false, error: 'Internal server error', message: error.message });
    }
}
