import { auth, JWT_SECRET } from "../../../firebase.js";
import jwt from 'jsonwebtoken';

// Function to handle session login
export async function sessionLogin(req, res, next) {
    // Get the ID token from the request body and convert it to a string
    const idToken = req.body.idToken ? req.body.idToken.toString() : null;

    // If the ID token is missing, return a 400 Bad Request response
    if (!idToken) {
        return res.status(400).send('Missing ID token');
    }

    try {
        // Verify the ID token using Firebase Auth
        const decodedIdToken = await auth.verifyIdToken(idToken);

        // Check if the ID token was issued within the last 5 minutes
        if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {
            // Generate a session token with a 5-day expiration using the decoded UID
            const sessionToken = jwt.sign({ uid: decodedIdToken.uid }, JWT_SECRET, { expiresIn: '5d' });

            // Return the session token in the response
            res.status(200).json({ sessionToken });
        } else {
            // If the ID token is older than 5 minutes, return a 401 Unauthorized response
            res.status(401).send('Recent sign in required!');
        }
    } catch (error) {
        // If there is an error during verification, return a 401 Unauthorized response with error details
        res.status(401).send({ error: 'UNAUTHORIZED REQUEST!', details: error.message });
    }
}



/* export async function sessionLogin(req, res, next) {
    // Ottieni il token ID passato e il token CSRF
    const idToken = req.body.idToken ? req.body.idToken.toString() : null;
    //const csrfToken = req.body.csrfToken ? req.body.csrfToken.toString() : null;

    if (!idToken) {
        return res.status(400).send('Missing ID token');
    }

   /*  if (!idToken || !csrfToken) {
        return res.status(400).send('Missing tokens');
    } */

   /*  // Verifica se il cookie è presente
    if (!req.cookies['__Host-psifi.x-csrf-token']) {
        return res.status(400).send('CSRF token cookie not found');
    } 

    try {
        // Get the ID token passed and the CSRF token.
       /*  const idToken = req.body.idToken.toString();
        const csrfToken = req.body.csrfToken.toString(); */

/*         // Estrai i token dal cookie
        const cookieTokens = req.cookies['__Host-psifi.x-csrf-token'].split('|');
        const [csrfTokenFromCookie] = cookieTokens; // Prendi solo il primo token */

        /* // Guard against CSRF attacks.
        if (csrfToken !== csrfTokenFromCookie) {
            res.status(401).send({ error: 'UNAUTHORIZED REQUEST!', details: csrfToken, cookie: req.cookies['__Host-psifi.x-csrf-token'] });
            return;
        }


        // Set session expiration to 5 days.
        const expiresIn = 60 * 60 * 24 * 5 * 1000;

        // Verify the ID token
        const decodedIdToken = await auth.verifyIdToken(idToken);

        // Only process if the user just signed in in the last 5 minutes.
        if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {
            // Create session cookie and set it.
            //const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

            const sessionToken = jwt.sign({ uid: decodedIdToken.uid }, JWT_SECRET, { expiresIn: '5d' });


            // Set cookie policy for session cookie.
            const options = { maxAge: expiresIn, httpOnly: true, secure: true, sameSite: 'none', partitioned: true };
            res.cookie('session', sessionCookie, options);
            res.end(JSON.stringify({ status: 'success' })); 
            res.status(200).json({ sessionToken });
            req.user = decodedIdToken;
            return next();
        } else {
            // A user that was not recently signed in is trying to set a session cookie.
            // To guard against ID token theft, require re-authentication.
            res.status(401).send('Recent sign in required!');
            res.redirect(req.headers.referer || '/login');

            return;
        }
    } catch (error) {
        res.status(401).send({ error: 'UNAUTHORIZED REQUEST!', details: error.message });

    }
} */

