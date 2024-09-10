
import { auth } from "../../firebase.js";


/**
 * Middleware for user authentication.
 * Verifies the authenticity of the ID token provided in the Authorization header.
 * If valid, stores the decoded user information in the request data (`req.user`).
 * Sets a secure HTTP-only cookie (`authToken`) containing the ID token for subsequent requests.
 * Logs an error and returns a 401 Unauthorized response if the token is missing, invalid, or expired.
 */
export const authenticateUser = async (req, res, next) => {
    try {
        const idToken = req.headers.authorization;

        // Check if the Authorization token is provided
        if (!idToken) {
            return res.status(401).json({ message: 'Authorization token not provided' });
        }

        let checkRevoked = true; // Check if the token has been revoked

        // Verify the ID token's authenticity using Firebase Admin SDK with checkRevoked
        const decodedToken = await auth.verifyIdToken(idToken.replace('Bearer ', ''), checkRevoked);

        // Store the verified user data in the request object
        req.user = decodedToken;

        // Extract the token without 'Bearer ' prefix
        const authTokenWithoutBearer = idToken.replace('Bearer ', '');

        // Check if the request is secure (HTTPS)
        const secureCookie = req.secure || req.headers['x-forwarded-proto'] === 'https';

        // Set a secure HTTP-only cookie 'authToken' containing the ID token
        res.cookie('authToken', authTokenWithoutBearer, {
            secure: secureCookie, // Set to true only if the request is secure (HTTPS)
            sameSite: 'strict', // Enforce strict same-site policy
            httpOnly: true // Make the cookie accessible only through HTTP(S) requests
        });

        // Log the setting of the authToken cookie (optional)
        // console.log('Cookie authToken set:', authTokenWithoutBearer);

        return next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid or expired authorization token' });
    }
};
