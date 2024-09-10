import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import Stripe from  'stripe';
import * as dotenv from 'dotenv'
import * as fs from 'fs';
import { cert, initializeApp } from "firebase-admin/app";

const ENV = process.env.NODE_ENV || 'stag';
dotenv.config({ path: `.env.${ENV}` });
// Read the content of the JSON file containing the service account key
/* const serviceAccountContent = fs.readFileSync('./serviceAccountKey.json', 'utf8'); */
// Legge il contenuto del file JSON contenente la chiave dell'account di servizio
const serviceAccountContent = fs.readFileSync(process.env.SERVICE_ACCOUNT_KEY, 'utf8');

// Parse the JSON string into a JavaScript object
const serviceAccountObject = JSON.parse(serviceAccountContent);

// Initialize the Firebase Admin SDK with the service account credentials
const firebaseAdminApp = initializeApp({
    credential: cert(serviceAccountObject)
});

// Initialize Firestore database using the Firebase Admin app instance
export const db = getFirestore(firebaseAdminApp);

// Initialize Firebase Authentication using the Firebase Admin app instance
export const auth = getAuth(firebaseAdminApp);

// Initialize Stripe with the secret key from environment variables
export const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Jwt with the secret key from environment variables
export const JWT_SECRET = process.env.JWT_SECRET