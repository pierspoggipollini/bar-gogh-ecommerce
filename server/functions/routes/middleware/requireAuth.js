import jwt from 'jsonwebtoken';
import { isInBlacklist } from '../users/blackList.js';
import { JWT_SECRET, auth } from '../../firebase.js';
import { getUserDataFromDatabase } from '../users/login/getProfile.js';

// Middleware to verify JWT token
/* export async function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).send('Missing or invalid JWT token');
    }

    const tokenString = token.split('Bearer ')[1];

    try {
        // Check if the token is in the blacklist
        const isBlacklisted = await isInBlacklist(tokenString);
        if (isBlacklisted) {
            return res.status(401).send('Token is in blacklist');
        }

        // Decode the JWT token to get the claims
        const decoded = jwt.verify(tokenString, JWT_SECRET);

        if (!decoded || !decoded.uid) {
            return res.status(401).send('Invalid JWT token');
        }
        // Retrieve user data from the database using the user ID
        const userDataObject = await getUserDataFromDatabase(decoded.uid);
        const { user } = userDataObject;

        // Add user data to the req object to make it available to subsequent route handlers
        req.user = user;

        // Proceed with handling the request
        next();
    } catch (error) {
        return res.status(401).send({ error: 'Invalid JWT token', token: tokenString, details: error.message });
    }
} */

// Function to retrieve user data
async function verifyAuthentication(req) {
    const token = req.headers['authorization'];

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).send('Missing or invalid JWT token');
    }

    const tokenString = token.split('Bearer ')[1];

    try {
        // Check if the token is in the blacklist
        const isBlacklisted = await isInBlacklist(tokenString);
        if (isBlacklisted) {
            return res.status(401).send('Token is in blacklist');
        }

        // Decode the JWT token to get the claims
        const decoded = jwt.verify(tokenString, JWT_SECRET);

        if (!decoded || !decoded.uid) {
            return res.status(401).send('Invalid JWT token');
        }
        // Retrieve user data from the database using the user ID
        const userDataObject = await getUserDataFromDatabase(decoded.uid);
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
export async function requireAuth(req, res, next) {
    try {
        // Perform authentication verification
        const { success, user } = await verifyAuthentication(req);
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

