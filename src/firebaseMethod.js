
import { initializeApp } from "firebase/app";
import {
    getAuth,
    getAdditionalUserInfo
} from "firebase/auth";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    serverTimestamp,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { productsData } from "./productsData";
import { promoCodes } from "./promoCodes";
import { callCsrfToken } from "./components/Form/CallCsrfToken";
import axios from "axios";
import firebaseConfig from "./config/firebaseConfig";
import apiBaseUrl from "./config/apiConfig";


// Initialize Firebase app with the provided configuration
const app = initializeApp(firebaseConfig);

// Initialize Firestore database instance
export const db = getFirestore(app);

// Initialize Firebase Authentication instance
export const auth = getAuth(app);

// Initialize GoogleAuthProvider instance
const provider = new GoogleAuthProvider();

// Update the order status history for a specific order in the Firestore database
export async function updateOrderStatusHistory(uid, orderId, newObjectStatus) {
    // Reference to the user document in Firestore
    const userDocRef = doc(db, "users", uid);

    // Reference to the orders collection within the user document
    const ordersCollectionRef = collection(userDocRef, "orders");

    // Reference to the specific order document within the orders collection
    const orderDocRef = doc(ordersCollectionRef, orderId);

    try {
        // Retrieve the current snapshot of the order document
        const orderDocSnapshot = await getDoc(orderDocRef);

        // Check if the order document exists
        if (orderDocSnapshot.exists()) {
            // Extract the data from the order document
            const orderData = orderDocSnapshot.data();

            // Update the status history array by adding the new status object
            const updatedStatusHistory = [
                ...orderData.statusHistory,
                newObjectStatus
            ];

            // Use the update method to only update the statusHistory array
            await updateDoc(orderDocRef, {
                statusHistory: updatedStatusHistory,
            });

            console.log('Order status history update completed.');
        } else {
            console.log('The order document does not exist.');
        }
    } catch (error) {
        console.error('Error updating order status history:', error);
    }
}

//const orderId = 'rq6nkOfOF7vS1dqvBXizn';
//const newObjectStatus = { status: 'shipped', date: '29/01/2024' }

//updateOrderStatusHistory(uid, orderId, newObjectStatus);

export async function createProductsCollection() {
    try {
        // Check if the "products" collection already exists
        const productsCollection = collection(db, "products");
        const snapshot = await getDocs(productsCollection);

        if (snapshot.empty) {
            // The "products" collection doesn't exist, so create it and add the products
            for (const product of productsData) {
                // Add a timestamp to the product before adding it to the database
                const productWithTimestamp = {
                    ...product,
                    timestamp: serverTimestamp(),
                };

                const docRef = await addDoc(productsCollection, productWithTimestamp);
                console.log("Product added successfully with ID:", docRef.id);
                // Aggiorna il documento con l'ID generato
                await updateDoc(docRef, { id: docRef.id });
            }

            console.log(
                "All products have been added to the Firestore database.",
            );
        } else {
            // The "products" collection already exists, so do nothing
            console.log(
                'The "products" collection already exists in the Firestore database.',
            );
        }
    } catch (e) {
        console.error(
            'Error while creating the "products" collection and adding products:',
            e,
        );
    }
}

export async function updateIngredientsToLowerCase() {
    try {
        // Get the collection reference for 'products'
        const productsCollection = collection(db, 'products');

        // Retrieve all documents from the 'products' collection
        const snapshot = await getDocs(productsCollection);

        // Check if the collection is empty
        if (snapshot.empty) {
            console.log('No products found in the Firestore database.');
            return;
        }

        // Iterate through each document in the collection
        for (const doc of snapshot.docs) {
            const data = doc.data();

            // Check if the document has an 'ingredients' field
            if (data.ingredients) {
                // Convert each ingredient to lowercase
                const updatedIngredients = data.ingredients.map(ingredient => ingredient.toLowerCase());

                // Update the document with the converted ingredients
                await updateDoc(doc.ref, { ingredients: updatedIngredients });
                console.log(`Updated document ${doc.id}`);
            }
        }

        // Log a success message after all ingredients have been updated
        console.log('All ingredients have been updated to lowercase.');
    } catch (error) {
        // Handle any errors that occur during the update process
        console.error('Error while updating ingredients:', error);
    }
}


// Execute the function
//updateIngredientsToLowerCase();


// Call the function to create the "products" collection and add products
//createProductsCollection();



export const createPromoCodesCollection = async () => {
    try {
        // Check if the "promo_codes" collection already exists
        const promoCodesCollection = collection(db, "promo_codes");
        const snapshot = await getDocs(promoCodesCollection);

        if (snapshot.empty) {
            // The "promoCodes" collection doesn't exist, so create it and add the promo codes
            for (const promotionalCode of promoCodes) {
                // Add a timestamp to the promo code before adding it to the Firestore database
                const promoCodesWithTimestamp = {
                    ...promotionalCode,
                    timestamp: serverTimestamp(),
                };

                const docRef = await addDoc(
                    promoCodesCollection,
                    promoCodesWithTimestamp,
                );
                console.log(
                    "Promo code added successfully with ID:",
                    docRef.id,
                );
            }

            console.log(
                "All promotional codes have been added to the Firestore database.",
            );
        } else {
            // The "promoCodes" collection already exists, so do nothing
            console.log(
                'The "promoCodes" collection already exists in the Firestore database.',
            );
        }
    } catch (e) {
        console.error(
            'Error while creating the "promoCodes" collection and adding promotional codes:',
            e,
        );
    }
};

// Call the function to create the "promoCodes" collection and add promotional codes
//createPromoCodesCollection();


// Update the statusHistory array
/* const updatedStatusHistory = [
  ...orderData.statusHistory,
  { status: 'shipped', date: "31/01/2024", via: "DHL Parcel Connect Europe" },
]; */


// Function to handle Google sign-in
export const signInWithGoogle = async () => {
    try {
        // Perform Google authentication using signInWithPopup
        const result = await signInWithPopup(auth, provider);

        // Obtain Google access token
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;

        // Get authenticated user information
        const user = result.user;

        // Get additional user information
        const additionalUserInfo = getAdditionalUserInfo(result)


        // Extract first name and last name from user profile, if available
        const profile = additionalUserInfo.profile;
        const firstName = profile.given_name || "";
        const lastName = profile.family_name || "";
        const fullName = profile.name || `${firstName} ${lastName}`;
        const email = user.email;
        const uid = user.uid;

        // Obtain CSRF token required for your API
        //const requestCsrfToken = await callCsrfToken(); // Assuming this function is defined elsewhere
        //const csrfToken = requestCsrfToken.csrfToken;

        // Send ID token to your server for session management
        const idToken = await user.getIdToken();
        const response = await axios.post(`${apiBaseUrl}sessionLogin`, { idToken });
        

        if (response.status !== 200) {
            throw new Error("Failed to login to the server");
        }

        const { sessionToken } = response.data;

        // Salva il sessionToken nel localStorage
        localStorage.setItem("session_JWT_Token", sessionToken);

        // Check if user exists in Firestore database
        const usersRef = doc(db, "users", uid);
        const userSnap = await getDoc(usersRef);

        if (!userSnap.exists()) {
            // If user does not exist in the database, save the information
            await setDoc(usersRef, {
                fullName: fullName,
                firstName: firstName,
                lastName: lastName,
                email: email,
                uid: uid,
                timestamp: serverTimestamp(),
            });
        }

        // No need to sign out immediately after successful login
        // auth.signOut();
        
        // Return user information
        return { user, fullName, firstName, lastName, email, idToken };
    } catch (error) {
        console.error('Error signing in with Google:', error);
        return null; // Return null if there's an error
    }
};