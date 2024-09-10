// Funzione per creare un PaymentMethod
export const createPaymentMethod = async (stripe, cardData) => {
    try {
        const { number, exp_month, exp_year, cvc } = cardData;

        const cardNumberWithoutSpaces = number?.replace(/\s/g, "");
        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: "card",
            card: {
                number: cardNumberWithoutSpaces,
                exp_month: exp_month,
                exp_year: exp_year,
                cvc: cvc,
            },
        });

        if (error) {
            console.error(error);
            // Gestisci l'errore, ad esempio mostrando un messaggio all'utente
            return { error };
        } else {
            // Invia l'ID del PaymentMethod al server
            const paymentMethodId = paymentMethod.id;
            return { paymentMethodId };
        }
    } catch (error) {
        console.error(error);
        return { error: "An error occurred while creating the payment method." };
    }
};
