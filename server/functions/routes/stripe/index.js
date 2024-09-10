import express from 'express';
import { postCreateCustomerId } from './postCreateCustomerId.js';
import { postCreatePaymentIntent } from './postCreatePaymentIntent.js';
import { getCustomerPaymentMethod } from './getCustomerPaymentMethod.js';
import { getStripeCustomerId } from './getStripeCustomerId.js';
import { postSendEmailConfirmation } from './postSendEmailConfirmation.js';
import { requireAuth } from '../middleware/requireAuth.js';

// Initialize an Express router for handling Stripe related routes
const stripeRouter = express.Router();

// Middleware to require authentication for all routes in this router
stripeRouter.use(requireAuth);

// Route to create a new customer in Stripe
stripeRouter.post('/create-customer', postCreateCustomerId);

// Route to create a payment intent in Stripe
stripeRouter.post('/create-payment-intent', postCreatePaymentIntent);

// Route to send email confirmation related to Stripe
stripeRouter.post('/send-email-confirmation', postSendEmailConfirmation);

// Route to retrieve Stripe customer ID
stripeRouter.get('/get-customer-id', getStripeCustomerId);

// Route to retrieve a specific payment method of a customer
stripeRouter.get('/customers/:stripeCustomerId/payment_methods/:paymentMethodId', getCustomerPaymentMethod);

// Export the configured stripeRouter for use in other parts of the application
export { stripeRouter };
