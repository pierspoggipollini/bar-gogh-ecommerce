import express from 'express';
import { postNewsletter } from './postNewsletter.js';

const newsletterRouter = express.Router();

// Route to handle POST requests to subscribe to the newsletter
newsletterRouter.post('/newsletter', postNewsletter);

export { newsletterRouter };