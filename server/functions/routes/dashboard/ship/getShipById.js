import { db } from "../../../firebase.js";

export async function getShipById(req, res) {
    try {
        // Ottieni l'ID dall'URL
        const addressId = req.params.id;
        // Ottieni i dati dell'utente autenticato dal middleware di autenticazione
        const { uid } = req.user;
        const userRef = db.collection("users").doc(uid);
        // Effettua una query al database di Firestore per ottenere la collezione di indirizzi dell'utente
        const addressDoc = await userRef
            .collection("addresses")
            .doc(addressId)
            .get();

        // Verifica se ci sono documenti nella collezione
        if (addressDoc.empty) {
            return res.status(404).json({ error: 'Address not found' });
        }

        // Ottieni i dati dell'indirizzo
        const addressData = addressDoc.data();
        addressData.id = addressDoc.id; // Aggiungi l'ID come proprietà dell'oggetto addressData


        // Restituisci i dettagli dell'utente come risposta
        return res.status(200).json(addressData);

    } catch (error) {
        console.error('Error getting shipping details:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}