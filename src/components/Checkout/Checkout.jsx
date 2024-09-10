import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SideCheckout } from "./SideCheckout";
import { NavbarForm } from "../Navbar/NavbarForm";
import { ShoppingCartCheckout } from "@mui/icons-material";
import { Promo } from "./Promo";
import * as checkoutActions from "../../store/checkout";
import * as userAuthActions from "../../store/user-auth";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "nanoid";
import { ShipOptions } from "./Ship/ShipOptions";
import { BillingAddress } from "./Addresses/Billing-address/BillingAddress";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutForm } from "./CheckoutForm";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseMethod";
import { Loader } from "../Loader/Loader";
import { Footer } from "../Footer/Footer";
import axiosInstance from "../../config/axiosInstance";
import { ScrollTopTopButton } from "../ScrollTopTopButton";
import { loadStripe } from "@stripe/stripe-js";

const Checkout = () => {
  const dispatch = useDispatch();
  // Load Stripe with the publishable key from environment variables
   const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  );

  const [isLoading, setIsLoading] = useState(false);

  // Extract data from Redux store
  const totalOrder = useSelector((state) => state.cart.totalOrder);
  const totalOrderInCents = Math.round(totalOrder * 100);
  const userAuthState = useSelector((state) => state.userAuth);
  const stripeCustomerId = userAuthState.user?.stripeCustomerId || null;
  const idOrder = useSelector((state) => state.checkout.idOrder);
  const uid = userAuthState.user.uid;
  const billingDetails = useSelector((state) => state.checkout.billingAddress);
  const { lastName, firstName } = billingDetails;

  const fullName = `${firstName} ${lastName}`;
  const userEmail = userAuthState.user.email;

  // Use state to manage clientSecret and general error
  const [clientSecret, setClientSecret] = useState(null);
  const [generalError, setGeneralError] = useState("");

  const userDocRef = doc(db, "users", uid);

  useEffect(() => {
    if (!idOrder) {
      // Generate a unique ID using nanoid if idOrder is not present
      const uniqueId = nanoid();
      dispatch(checkoutActions.addIdOrder(uniqueId)); // Dispatch the action to add the idOrder
    }
  }, [idOrder, dispatch]);

  // STRIPE

  const createCustomer = async () => {
    try {
      // Make a request to your server to create a customer using Stripe
      const response = await axiosInstance.post(`create-customer`, {
        name: fullName,
        email: userEmail,
      });

      // Extract the customer ID from the response
      const customerId = response.data.customer.id;

      // Update the Firestore document with the new customer ID
      await updateDoc(userDocRef, {
        stripeCustomerId: customerId,
      });

      dispatch(userAuthActions.setStripeCustomerId(customerId));

      // Return the customer data if needed
      return { customerId };
    } catch (error) {
      console.error("Error during the server request:", error);
      throw new Error("Failed to create customer");
    }
  };

  // Function to fetch the client secret from the server
  const fetchClientSecret = async (customerId) => {
    try {
      // Check if the totalOrderInCents is less than 1 and handle the case
      if (totalOrderInCents < 1) {
        setGeneralError("The amount must be greater than zero.");
        return;
      }

      // Make a request to the server to create a payment intent and get the clientSecret
      const response = await axiosInstance.post(`create-payment-intent`, {
        amount: totalOrderInCents,
        customerId: customerId,
        orderId: idOrder,
        currency: "eur",
      });

      // Extract the clientSecret from the response and update the state
      const clientSecret = response.data.clientSecret;
      setClientSecret(clientSecret);

      // Clear any previous general error
      setGeneralError("");
    } catch (error) {
      // Log the error and throw a custom error message
      console.error("Error during the server request:", error);
      throw new Error(
        "Sorry, the service is currently unavailable due to maintenance. Please try again later.",
      );
      // Handle errors, for example, show a message to the user
    }
  };

  // Function to fetch data
  const fetchData = async () => {
    setIsLoading(true); // Set loading state to true

    try {
      // Ensure that userDocRef is defined before proceeding
      if (!userDocRef) {
        console.error("userDocRef is not defined");
        return;
      }

      // Retrieve the document from the reference ID
      const userDocSnapshot = await getDoc(userDocRef);

      // Check if the document exists
      if (!userDocSnapshot.exists()) {
        console.error("User document does not exist.");
        return;
      }

      // Extract data from the document
      const userData = userDocSnapshot.data();

      // Check if the stripeCustomerId field exists in the data
      if (!userData.stripeCustomerId) {
        console.error(
          "The stripeCustomerId field does not exist in the user document.",
        );
      }

      // Check if stripeCustomerId exists
      if (!userData.stripeCustomerId) {
        // If the query is empty, wait for createCustomer to complete
        const userData = await createCustomer(); // Call createCustomer function
        const clientSecretResponse = await fetchClientSecret(
          userData.customerId,
        ); // Fetch client secret
      } else {
        // If stripeCustomerId exists, fetch client secret using it
        const clientSecretResponse = await fetchClientSecret(
          userData.stripeCustomerId,
        );
      }
    } catch (error) {
      // Handle errors
      console.error("Error during query or document retrieval:", error);
      console.error(error);
      setGeneralError(error.message); // Set general error state with the error message
    } finally {
      setIsLoading(false); // Set loading state to false after the operation is completed
    }
  };

  // Effect to fetch data when totalOrderInCents or totalOrder changes
  useEffect(() => {
    fetchData();
  }, [totalOrderInCents, totalOrder]);

  //Set the stripe loader
  const loader = "auto";

  // Memoized CheckoutHeader component for performance optimization
  const CheckoutHeader = useMemo(
    () => (
      <div
        className="flex gap-4 md:gap-0 md:justify-between text-slate-200 items-center min-w-full h-14 mb-1 "
        aria-label="Checkout Header"
      >
        {/* Checkout Title */}
        <h1
          className="text-xl lg:text-2xl font-semibold uppercase"
          aria-label="Checkout Title"
        >
          Checkout
        </h1>

        {/* Animated Shopping Cart Icon */}
        <motion.span
          initial={{ x: -345 }}
          animate={{ x: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 35,
          }}
          aria-label="Shopping Cart Icon"
        >
          <ShoppingCartCheckout sx={{ fontSize: "32px" }} />
        </motion.span>
      </div>
    ),
    [], // Empty dependency array as there are no dynamic dependencies
  );

  return (
    <>
      {/* Conditional rendering based on loading state */}
      {/* <ScrollToTop /> */}
      <>
        {isLoading ? (
          <>
            {/* Display loader component while preparing checkout */}
            <Loader
              text="One moment while we prepare checkout"
              loaderClass="loader"
            />
          </>
        ) : (
          <>
            {/* Render navigation bar form */}
            <NavbarForm />
            <ScrollTopTopButton />
            {/* Animated transition for the main checkout components */}
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key="cart-full"
                transition={{ duration: 1 }}
                className="relative my-6 mx-3 flex flex-col max-w-full items-center lg:items-start lg:flex-row lg:justify-center gap-4"
                aria-label="Main Checkout Container"
              >
                {/* Responsive Checkout Header */}
                <div className="order-1 lg:hidden flex gap-4 md:gap-0 md:justify-between text-slate-200 items-center h-14 w-full md:w-[32rem]">
                  {CheckoutHeader}
                </div>

                {/* Main Checkout Content */}
                <div className="w-full order-2 lg:order-1 max-w-[32.5rem] h-full">
                  <div className="hidden lg:flex  h-14 mb-4 ">
                    {CheckoutHeader}
                  </div>

                  {/* Render individual components within the main checkout */}
                  <div className="h-full max-w-full items-center space-y-1 flex flex-col justify-center gap-4 rounded-sm">
                    {/* Map through an array of checkout components and render them */}
                    {[
                      {
                        Component: Promo,
                        width: "full md:w-[32rem] lg:w-full",
                      },
                      {
                        Component: ShipOptions,
                        width: "full md:w-[32rem] lg:w-full",
                      },
                      {
                        Component: BillingAddress,
                        width: "full md:w-[32rem] lg:w-full",
                      },
                    ].map((item, index) => (
                      <div key={index} className={`w-${item.width}`}>
                        <item.Component {...item.props} />
                      </div>
                    ))}

                    {/* Display general error message if present */}
                    {generalError && (
                      <span
                        className="text-red-200 text-sm"
                        aria-label="General Error Message"
                      >
                        {generalError}
                      </span>
                    )}

                    {/* Render checkout form if Stripe promise and clientSecret are available */}
                    {stripePromise && clientSecret && !generalError ? (
                      <div className="full md:w-[32rem] lg:w-full">
                        <Elements
                          stripe={stripePromise}
                          options={{
                            clientSecret: clientSecret,
                            locale: "en",
                            appearance: {
                              theme: "stripe",
                              variables: {
                                colorPrimary: "hsl(0, 0%, 12%)",
                                fontFamily: "Sora, sans-serif",
                              },
                              labels: "floating",
                            },
                            loader: loader,
                          }}
                        >
                          {/* Render checkout form component */}
                          <CheckoutForm />
                        </Elements>
                      </div>
                    ) : (
                      <span
                        className="text-red-200 text-sm"
                        aria-label="General Error Message"
                      >
                        Payment methods is not currently available. Please try
                        again later!
                      </span>
                    )}
                  </div>
                </div>

                {/* Sidebar Checkout Panel */}
                <div
                  className={`h-full order-1 w-full md:w-[32rem] lg:w-[25rem] justify-center flex lg:sticky lg:top-7`}
                  aria-label="Sidebar Checkout Panel"
                >
                  <SideCheckout />
                </div>
              </motion.div>
            </AnimatePresence>
            <Footer />
          </>
        )}
      </>
    </>
  );
};

// Export Checkout component
export default Checkout;
