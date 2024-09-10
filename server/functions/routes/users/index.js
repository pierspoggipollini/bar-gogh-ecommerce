import express from 'express';
import { getProfile } from './login/getProfile.js';
import { sessionLogin } from './login/sessionLogin.js';
import { sessionLogout } from './login/sessionLogout.js';
import { postGeneratePasswordResetLink } from './postGeneratePasswordResetLink.js';
import { requireAuth } from '../middleware/requireAuth.js';

// Create an Express router instance
const usersRouter = express.Router();

// Define routes for handling user sessions
// Route to handle user login and create a session
usersRouter.post('/sessionLogin', sessionLogin);

// Route to retrieve user profile information
usersRouter.get('/profile', requireAuth, getProfile);

// Route to handle user logout and clear the session
usersRouter.post('/sessionLogout', requireAuth, sessionLogout);

// Route to handle sending password reset email
usersRouter.post('/sendPasswordResetEmail', postGeneratePasswordResetLink);

// Export the router for use in other parts of the application
export { usersRouter };