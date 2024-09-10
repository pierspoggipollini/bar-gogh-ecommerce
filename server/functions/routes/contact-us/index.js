import { postContact } from "./postContact.js";
import express from 'express';


const contactRouter = express.Router();

// Route to handle POST requests to send a message
contactRouter.post('/send-message', postContact);

export { contactRouter };