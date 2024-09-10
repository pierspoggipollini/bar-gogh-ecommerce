import { db } from "../../../firebase.js";

export async function getShipInfo(req, res) {
    try {
        // Ottieni i dati dell'utente autenticato dal middleware di autenticazione
        const { uid } = req.user;
        const usersRef = db.collection("users").doc(uid);
        // Effettua una query al database di Firestore per ottenere la collezione di indirizzi dell'utente
        const addressesQuerySnapshot = await usersRef
            .collection("addresses")
            .get();

        // Verifica se ci sono documenti nella collezione
        if (addressesQuerySnapshot.empty) {
            return res.status(404).json({ success: false, error: 'Shipping details not found' });
        }


        // Ottieni i dati degli indirizzi con l'ID incluso nei dati stessi
        const addressesData = addressesQuerySnapshot.docs.map((doc) => {
            const data = doc.data();
            data.id = doc.id; // Aggiungi l'ID come proprietà dell'oggetto data
            return data;
        });

        // Restituisci i dettagli dell'utente come risposta
        return res.status(200).json({ success: true, address: addressesData });

    } catch (error) {
        console.error('Error getting shipping details:', error);
        return res.status(500).json({ success: false, message: 'Error getting shipping details', error: error });
    }
}