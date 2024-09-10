import { Timestamp } from "firebase-admin/firestore";
import { db } from "../../firebase.js";

// Funzione per aggiungere un token alla blacklist
export async function addToBlacklist(token) {
    try {
        const blacklistRef = db.collection('blacklist');
        await blacklistRef.doc(token).set({
            revokedAt: Timestamp.now()
        });
    } catch (error) {
        console.error('Error adding token to blacklist:', error);
    }
}

// Funzione per verificare se un token è nella blacklist
export async function isInBlacklist(token) {
    try {
        const blacklistRef = db.collection('blacklist');
        const snapshot = await blacklistRef.doc(token).get();
        return snapshot.exists;
    } catch (error) {
        console.error('Error checking blacklist:', error);
        return false;
    }
}
