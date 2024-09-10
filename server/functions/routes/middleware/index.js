import express from 'express';
import { getCsrfToken } from './getCsrfToken.js';
import { doubleCsrf } from 'csrf-csrf';

// Initialize Express router for CSRF protection
const csrfRouter = express.Router();

// CSRF middleware setup
const {
    doubleCsrfProtection,
} = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET,
    cookieName: "__Host-psifi.x-csrf-token",
    cookieOptions: {
        sameSite: "none", // Usa None per richieste cross-origin
        path: "/",
        secure: true, // Assicurati che il sito sia servito tramite HTTPS
        expires: new Date(Date.now() + 60 * 60 * 24 * 5 * 1000), // Scadenza in 5 giorni
        httpOnly: true, // Assicurati che sia impostato su false
        partitioned: true,
    },
    size: 64,
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],
    getTokenFromRequest: (req) => req.headers["x-csrf-token"],
});

// Apply CSRF protection middleware to all routes
csrfRouter.use(doubleCsrfProtection);

// Endpoint to retrieve CSRF token (only for GET requests)
csrfRouter.get('', getCsrfToken);

export { csrfRouter };
