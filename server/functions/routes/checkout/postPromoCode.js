import { db } from "../../firebase.js";

/**
 * Handles the validation of a promotional code.
 * 
 * Validates if the provided promotional code exists, is active on the current date,
 * and retrieves the discount percentage associated with it.
 * 
 * @param {Object} req - Express request object containing the promotional code in the body.
 * @param {Object} res - Express response object for sending a JSON response.
 */
export async function postPromoCode(req, res) {
    const { code } = req.body;

    try {
        const currentDate = new Date();
        const currentDateStr = currentDate.toISOString().substring(0, 10);

        // Query Firestore for the promotional code
        const promoCodesRef = db.collection('promo_codes');
        const querySnapshot = await promoCodesRef
            .where('code', '==', code)
            .where('startDate', '<=', currentDateStr)
            .where('endDate', '>=', currentDateStr)
            .get();

        // Filter the querySnapshot based on startDate and endDate conditions
        /*  const promoCodeData = querySnapshot.docs
             .filter(doc => doc.data().startDate <= currentDateStr)
             .filter(doc => doc.data().endDate >= currentDateStr)[0]?.data(); */

        // Check if the promotional code exists and is active
        if (!querySnapshot.docs.length) {
            res.status(404).json({ error: 'Invalid promotional code' });
        } else {
            // Retrieve the discount percentage associated with the promotional code
            const { discount } = querySnapshot.docs[0].data();
            console.log(discount);
            res.status(200).json({ valid: true, discount });
        }
    } catch (error) {
        console.error('Error while verifying the promotional code:', error);
        res.status(500).json({ error: 'Error while verifying the promotional code' });
    }
}
