import { db } from "../../firebase.js";
import { sendEmail } from "../sendEmail.js";
import { emailTemplate } from "./emailTemplate.js";


export async function postSendEmailConfirmation(req, res) {
    // Extract orderId, email, and uid from request body
    const { orderId, email, uid } = req.body;

    try {
        // Reference to the user document in Firestore
        const userDocRef = db.collection("users").doc(uid);

        // Reference to the specific order document within user's orders
        const orderDocRef = userDocRef.collection("orders").doc(orderId);

        // Retrieve the order document snapshot
        const orderSnapshot = await orderDocRef.get();

        // Extract order data from the snapshot, or initialize as empty object if snapshot doesn't exist
        const orderData = orderSnapshot.exists ? orderSnapshot.data() : {};

        // Destructure relevant fields from orderData, or set defaults if orderData is empty
        const {
            orderFullName,
            billingDetails,
            shippingDetails,
            shipCost,
            pickupInStore,
            shippingOption,
            subtotal,
            items,
            amount,
            discountAmount,
            currency,
            createdAt,
            status,
            statusHistory,
        } = orderData || {};

        // Define subject and HTML content for the email
        const subject = 'Order Confirmation';
        const text = ''; // Empty for now, can be used for plain text email if needed
        // Pass all order data as an object to emailTemplate function
        const html = emailTemplate({
            email: email,
            orderId: orderData.orderId,
            orderFullName: orderData.orderFullName,
            billingDetails: orderData.billingDetails,
            shippingDetails: orderData.shippingDetails,
            shipCost: orderData.shipCost,
            pickupInStore: orderData.pickupInStore,
            shippingOption: orderData.shippingOption,
            subtotal: orderData.subtotal,
            items: orderData.items,
            amount: orderData.amount,
            discountAmount: orderData.discountAmount,
            currency: orderData.currency,
            createdAt: orderData.createdAt,
            status: orderData.status,
            statusHistory: orderData.statusHistory,
        });

        // Send the email using the sendEmail function with subject and HTML content
        sendEmail(email, subject, text, html);
        // Send success response back to client with the data passed to sendEmail
        const response = {
            orderId,
            orderFullName,
            billingDetails,
            shippingDetails,
            shipCost,
            pickupInStore,
            shippingOption,
            subtotal,
            items,
            amount,
            discountAmount,
            currency,
            createdAt,
            status,
            statusHistory,
        };

        res.status(201).send({
            message: 'Order Confirmation sent successfully',
            emailData: response,
        });

        // Send success response back to client
        res.status(201).send('Order Confirmation sent successfully');
    } catch (error) {
        // Handle errors that occur during the process
        console.error("Error sending message: ", error);
        res.status(500).json({ error: "Error sending order confirmation", info: error.message });
    }
}
