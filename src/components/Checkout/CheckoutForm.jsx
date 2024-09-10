import React, { useState } from "react";
import { CheckoutButton } from "./Button/CheckoutButton";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { TermsAndConditions } from "./TermsAndCondition/TermsAndConditions";
import { ShoppingCartCheckoutOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebaseMethod";
import { useNavigate } from "react-router";
import * as CartActions from "../../store/cart";
import { formatTimestamp } from "../utilities/formatTimestamp";
import useCurrencyFormatter from "../utilities/currency/useCurrencyFormatter";
import axiosInstance from "../../config/axiosInstance";

/**
 * CheckoutForm component handling the payment process using Stripe.
 */
export const CheckoutForm = () => {
  // State for terms and conditions checkbox
  const [termscheck, setTermsCheck] = useState(false);
  const [errorTermsCheck, setErrorTermsCheck] = useState(false);
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const formatAmount = useCurrencyFormatter();
  // Redux state
  const userAuthState = useSelector((state) => state.userAuth);
  const checkoutReduxState = useSelector((state) => state.checkout);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Destructuring data from Redux state
  const { orderId, shipAddress, billingAddress, shippingOption } =
    checkoutReduxState;
  const billingDetails = useSelector((state) => state.checkout.billingAddress);
  const {
    country,
    lastName,
    firstName,
    phone,
    fullAddress,
    location,
    newAddress,
  } = billingDetails;

  // Constructing address line based on newAddress availability
  const addressLine1 =
    newAddress && newAddress.zipcode && newAddress.state && newAddress.city
      ? fullAddress
      : location;

  const cartReduxState = useSelector((state) => state.cart);
  const { subtotal, items, ship, pickupInStore, discountAmount } =
    cartReduxState;

  const updatesObject = items.reduce((acc, product) => {
    acc[product.product.id] = product.quantity;
    return acc;
  }, {});

  const fullName = (firstName, lastName) => {
    return `${firstName} ${lastName}`;
  };
  const userEmail = userAuthState.user.email;
  const uid = userAuthState.user.uid;
  const orderFirstName = userAuthState.user.firstName;
  const orderLastName = userAuthState.user.lastName;

  // Handling terms and conditions checkbox change
  const handleConfirmationChange = (e) => {
    setTermsCheck(e.target.checked);
    setErrorTermsCheck(false);
  };

  // Options for Stripe PaymentElement
  const options = {
    business: {
      name: "Bar Gogh",
    },
    defaultValues: {
      billingDetails: {
        email: userEmail,
        name: fullName(firstName, lastName),
        phone: phone,
        address: {
          postal_code: newAddress?.zipcode,
          state: newAddress?.state,
          city: newAddress?.city,
          country: country,
          line1: addressLine1,
        },
      },
    },
  };

  // Stripe hooks for payment handling
  const stripe = useStripe();
  const elements = useElements();

  const fetchSendEmailConfirmation = async (orderId, email, uid) => {
    try {
      const response = await axiosInstance.post(`/send-email-confirmation`, {
        orderId,
        email,
        uid,
      });
      return response.data;
    } catch (error) {
      console.error("Error sending email confirmation:", error.message); // Log dell'errore per il debugging
      throw error;
    }
  };

 const updateProductQuantities = async (items) => {
   try {
     for (const item of items) {
       const productId = item.product.id;
       const orderedQuantity = item.quantity;

       // Retrieve product details
       const productRef = doc(db, "products", productId);
       const productSnap = await getDoc(productRef);

       if (productSnap.exists()) {
         // Get current product data
         const productData = productSnap.data();
         const currentQuantity = productData.availableQuantity;

         if (currentQuantity >= orderedQuantity) {
           // Calculate new quantity after order
           const newQuantity = currentQuantity - orderedQuantity;

           // Update Firestore document with new quantity
           await updateDoc(productRef, { availableQuantity: newQuantity });
         } else {
           // Log a warning if there is not enough quantity available
           console.warn(
             `Product ID: ${productId} - Not enough quantity available`,
           );
         }
       } else {
         // Log an error if the product does not exist
         console.error(`Product ID: ${productId} - Product does not exist`);
       }
     }
   } catch (error) {
     // Handle and log any errors that occur during the update process
     console.error("Error updating product quantities:", error);
   }
 };


  // Handling form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Checking if terms and conditions are accepted
    if (!termscheck) {
      setErrorTermsCheck(true);
      return;
    }

    // Checking if Stripe and Elements are available
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded. Disable form submission until Stripe.js has loaded.
      return;
    }

    // Confirming the payment with Stripe
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${import.meta.env.VITE_FIREBASE_URL}/confirmation/${orderId}`,
      },
      redirect: "if_required",
    });

    if (error) {
      // Immediate error when confirming the payment
      setErrorMessage(error.message);
      return;
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Payment succeeded
      setMessage(`Payment successfully completed! 🎉`);
      setErrorMessage("");
      // Extracting information from the paymentIntent
      const createdAt = formatTimestamp(paymentIntent.created);
      const paymentIntentId = paymentIntent.id;
      const paymentMethodId = paymentIntent.payment_method;
      const amount = formatAmount(paymentIntent.amount / 100);
      const currency = paymentIntent.currency;

      // Updating the orders collection in Firestore
      const userDocRef = doc(db, "users", uid);
      const ordersCollectionRef = collection(userDocRef, "orders");

      // Updating the product quantities in Firestore
      await updateProductQuantities(items);

      const updateOrders = await setDoc(doc(ordersCollectionRef, orderId), {
        orderId: orderId,
        paymentIntentId: paymentIntentId,
        paymentMethodId: paymentMethodId,
        orderFullName: fullName(orderFirstName, orderLastName),
        billingDetails: billingAddress,
        shippingDetails: shipAddress,
        shipCost: parseFloat(ship),
        pickupInStore: pickupInStore,
        shippingOption: shippingOption,
        subtotal: parseFloat(subtotal),
        items: items,
        amount: amount,
        discountAmount: parseFloat(discountAmount),
        currency: currency,
        createdAt: createdAt,
        status: "pending",
        statusHistory: [{ status: "pending", date: createdAt }],
      });

      setTimeout(() => {
        try {
          navigate(`/confirmation/${orderId}`);
          dispatch(CartActions.resetCart());

          // Send the email confirmation in the background
          fetchSendEmailConfirmation(orderId, userEmail, uid).catch(
            (emailError) => {
              console.error(
                "Failed to send email confirmation:",
                emailError.message,
              );
            },
          );
        } catch (error) {
          console.error("Navigation to confirmation page failed:", error);
          setErrorMessage("Navigation to confirmation page failed");
        }
      }, 2500);
    } else {
      // Unexpected state
      setErrorMessage("Unexpected State");
    }
  };

  return (
    <>
      {/* Payment form container */}
      <div className="flex flex-col p-4 gap-4 bg-slate-100 rounded-lg  h-full w-full">
        {/* Section header */}
        <div className="max-h-20  w-full flex justify-between items-center">
          <h1 className="text-lg md:text-xl font-bold uppercase text-primary-black">
            Payment
          </h1>
        </div>

        {/* Payment form */}
        <form
          onSubmit={handleSubmit}
          id="payment-form"
          className="w-full z-10  flex flex-col gap-3"
          aria-label="Payment Form"
        >
          {/* PaymentElement component */}
          <PaymentElement options={options} />

          {/* Terms and conditions checkbox */}
          <TermsAndConditions
            checked={termscheck}
            aria={termscheck}
            onInputChange={handleConfirmationChange}
            error={errorTermsCheck}
            errorBorder={errorTermsCheck && "border border-red-700"}
          />

          <div className="grid place-content-center">
            {/* Checkout button */}
            <CheckoutButton
              saveFunction={handleSubmit}
              disabled={!stripe || !termscheck}
              icon={<ShoppingCartCheckoutOutlined />}
            />
          </div>

          {/* Error messages */}
          {errorMessage && (
            <div
              className="text-center text-sm w-full text-red-700"
              aria-label="Error Message"
            >
              {errorMessage}
            </div>
          )}
          {/* Success message */}
          {message && (
            <div
              className="text-center text-sm w-full text-green-700"
              aria-label="Success Message"
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </>
  );
};
