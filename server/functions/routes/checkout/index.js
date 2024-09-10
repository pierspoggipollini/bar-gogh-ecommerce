import express from 'express';
import { postPromoCode } from './postPromoCode.js';

/**
 * Router for handling promotional code validation during checkout.
 * Handles POST requests to validate a promotional code.
 */
const checkoutRouter = express.Router();

// Route to handle POST requests for validating promotional codes during checkout
checkoutRouter.post('/promotional-code', postPromoCode);

export { checkoutRouter };
