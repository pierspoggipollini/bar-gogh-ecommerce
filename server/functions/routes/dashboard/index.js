import express from 'express';
import { getShipInfo } from './ship/getShipInfo.js';
import { getShipById } from './ship/getShipById.js';
import { getOrders } from './orders/getOrders.js';
import { getCreditCards } from './payment/getCreditCards.js';
import { getCreditCardById } from './payment/getCreditCardById.js';
import { updateProfile } from './profile/updateProfile.js';
import { requireAuth } from '../middleware/requireAuth.js';

// Create a new instance of an Express router for dashboard routes
const dashboardRouter = express.Router();

// Apply 'requireAuth' middleware to all routes in this router to ensure authentication
dashboardRouter.use(requireAuth);

// Route to handle updating user profile information
dashboardRouter.put('/updateProfile', updateProfile);

// Route to fetch shipping information
dashboardRouter.get('/ship-info', getShipInfo);

// Route to fetch shipping information by specific ID
dashboardRouter.get('/ship-info/:id', getShipById);

// Route to fetch user's orders
dashboardRouter.get('/my-orders', getOrders);

// Route to fetch user's credit cards
dashboardRouter.get('/credit-cards', getCreditCards);

// Route to fetch user's credit card details by specific ID
dashboardRouter.get('/credit-cards/:id', getCreditCardById);

// Export the dashboardRouter with all defined routes
export { dashboardRouter };
