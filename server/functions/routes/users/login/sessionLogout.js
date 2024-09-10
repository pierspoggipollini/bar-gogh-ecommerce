import { auth } from "../../../firebase.js";
import { addToBlacklist } from "../blackList.js";

/**
 * Endpoint to log out the user session.
 * It revokes the session token by adding it to a blacklist.
 * @param {Request} req - The request object containing headers.
 * @param {Response} res - The response object to send back.
 */
export async function sessionLogout(req, res) {
    try {
        // Extract the Authorization header containing the session token
        const authorizationHeader = req.headers['authorization'];

        // Check if the Authorization header exists and starts with 'Bearer '
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            return res.status(401).send('Not logged in');
        }

        // Extract the session token from the Authorization header
        const sessionToken = authorizationHeader.split('Bearer ')[1];

        // Add the session token to the blacklist to revoke it
        await addToBlacklist(sessionToken);

        // Send a success response indicating the user is logged out
        res.status(200).send('Logged out');
    } catch (error) {
        // Handle errors that may occur during the logout process
        console.error('Error logging out:', error);

        // Handle the case where the session cookie is not valid or doesn't exist
        if (error.code === 'auth/argument-error') {
            res.status(401).send('Not logged in');
        } else {
            // Handle other unexpected errors
            res.status(500).send('Internal Server Error');
        }
    }
}


/* export async function sessionLogout(req, res) {
    try {
        const sessionCookie = req.cookies.session.toString() || '';
        let checkRevoked = true;

        // Clear the session cookie from the client
        //res.clearCookie('session');
        // Clear the __Host-psifi.x-csrf-token cookie from the client
        //res.clearCookie('__Host-psifi.x-csrf-token');

        // Verify the session cookie and revoke refresh tokens
        //const decodedClaims = await auth.verifySessionCookie(sessionCookie, checkRevoked);

        if (sessionToken) {
            // Aggiungi il token alla blacklist
            await addToBlacklist(sessionToken);
        }
        await auth.revokeRefreshTokens(decodedClaims.sub);

        // Send a success response
        res.status(200).send('Logged out');
    } catch (error) {
        // Handle the case where the session cookie is not valid or doesn't exist
        if (error.code === 'auth/argument-error') {
            res.status(401).send('Not logged in');
        } else {
            // Handle other errors
            res.status(500).send('Internal Server Error');
        }
    }
} */
