import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { db } from "../../../firebaseMethod";
import { useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "../../Navbar/Navbar";
import { Loader } from "../../Loader/Loader";
import { ButtonHomepage } from "../Button/ButtonHomepage";
import { cardImages } from "../../Dashboard/Payment/CardImages";
import { Footer } from "../../Footer/Footer";
import OrderSummarySidebar from "./OrderSummarySidebar";
import useCurrencyFormatter from "../../utilities/currency/useCurrencyFormatter";
import axiosInstance from "../../../config/axiosInstance";
import { ScrollTopTopButton } from "../../ScrollTopTopButton";

const OrderConfirmation = () => {
  const { id } = useParams();
  const formatAmount = useCurrencyFormatter();
  const [orderData, setOrderData] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const uid = useSelector((state) => state.userAuth.user.uid);
  const userAuthState = useSelector((state) => state.userAuth);
  const stripeCustomerId = userAuthState.user?.stripeCustomerId || null;

  const userEmail = userAuthState.user.email;
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrderData = async () => {
    setIsLoading(true);
    // Fetch the order data using the provided ID.
    try {
      const userDocRef = doc(db, "users", uid);
      const orderDocRef = doc(userDocRef, "orders", id);

      const orderDataSnapshot = await getDoc(orderDocRef);

      if (orderDataSnapshot.exists()) {
        // The order data is present in orderDataSnapshot.data()
        const orderData = orderDataSnapshot.data();
        setOrderData(orderData);
      } else {
        throw new Error("Oops! It seems that the order doesn't exist.");
      }
    } catch (error) {
      console.error(error);
      throw new Error("Oops! It seems that the order doesn't exist.");
    } finally {
      setIsLoading(false);
    }
  };

  const {
    orderId,
    orderFullName,
    billingDetails,
    shippingDetails,
    shipCost,
    pickupInStore,
    shippingOption,
    subtotal,
    items,
    paymentIntentId,
    paymentMethodId,
    amount,
    discountAmount,
    currency,
    createdAt,
    status,
    statusHistory,
  } = orderData || {};

  // Function to fetch the payment method details
  const fetchPaymentMethod = useCallback(async () => {
    // Check if stripeCustomerId or paymentMethodId is missing
    if (!stripeCustomerId || !paymentMethodId) {
      // If either is missing, set an error message and stop the loading state
      setErrorMessage("Payment method not available.");
      setIsLoading(false);
      return;
    }

    try {
      // Make an API call to fetch the payment method details
      const response = await axiosInstance.get(
        `customers/${stripeCustomerId}/payment_methods/${paymentMethodId}`,
      );
      // If successful, set the payment method details to the state
      setPaymentMethod(response.data.card);
    } catch (error) {
      // If there's an error, log it and set an error message
      console.error(error);
      setErrorMessage("Payment method not found.");
    } finally {
      // Ensure the loading state is stopped
      setIsLoading(false);
    }
  }, [stripeCustomerId, paymentMethodId]);

  // Parse the subtotal to a float
  const subtotalOrder = parseFloat(subtotal);

  useEffect(() => {
    // Function to fetch both order data and payment method details
    const fetchData = async () => {
      try {
        // Fetch order data
        await fetchOrderData();
        // If fetchOrderData was successful, call fetchPaymentMethod
        fetchPaymentMethod();
        // Clear any previous error messages
        setErrorMessage("");
      } catch (error) {
        // Handle errors from fetchOrderData
        console.error(error);
        setErrorMessage(error.message);
      }
    };

    // Call fetchData when the component mounts or when id, stripeCustomerId, or paymentMethodId changes
    fetchData();
  }, [id, stripeCustomerId, paymentMethodId]);

  /* const createdAtInSeconds = createdAt.seconds;
const createdAtInMilliseconds = createdAtInSeconds * 1000; // Converti i secondi in millisecondi
const createdAtDate = new Date(createdAtInMilliseconds);

 */

  const confirmationData = [
    {
      category: "Ordered by",
      value: orderFullName,
    },
    {
      category: "Date",
      value: createdAt,
    },
    {
      category: "Order number",
      value: orderId,
    },
  ];

  // Calculate the number of items in the order
  const numbersOfItems = orderData.items?.length;

  // State variables for expected shipping date and type of shipping
  const [expectedShipDate, setExpectedShipDate] = useState(null);
  const [typeShip, setTypeShip] = useState(null);

  useEffect(() => {
    // Check if the shipping option includes "standard" shipping
    if (shippingOption && shippingOption["standard"]) {
      // If "standard" shipping is available, set the expected shipping date and type
      setExpectedShipDate(shippingOption["standard"].expectedShipDate);
      setTypeShip(shippingOption["standard"].type);
    }
    // Check if the shipping option includes "express" shipping
    else if (shippingOption && shippingOption["express"]) {
      // If "express" shipping is available, set the expected shipping date and type
      setExpectedShipDate(shippingOption["express"].expectedShipDate);
      setTypeShip(shippingOption["express"].type);
    }
    // Check if the shipping option includes "pickupInStore"
    else if (shippingOption && shippingOption["pickupInStore"]) {
      // If "pickupInStore" is available, set the type of shipping
      setTypeShip(shippingOption["pickupInStore"].type);
    }

    // Additional calculations or operations if necessary
  }, [shippingOption]); // Dependency array to re-run the effect when shippingOption changes

  const line = (
    <div className="flex after:w-32 after:flex-1 after:flex-shrink-0 after:border-b-slate-200 after:border after:border-slate-100 after:content-['']"></div>
  );

  const paidViaCard = (
    <div className="flex  gap-4 ">
      {paymentMethod.funding === "credit" ? (
        <div key={paymentMethod.brand} className="flex items-center gap-3">
          <img
            src={cardImages[paymentMethod.brand]}
            alt="credit card type"
            className="w-8 h-auto"
          />
          <span>{`${paymentMethod.brand.toUpperCase()} (${
            paymentMethod.last4
          })`}</span>
        </div>
      ) : (
        <div>
          <p>Not available</p>
        </div>
      )}
    </div>
  );

  const ConfirmationHeader = () => {
    return (
      <div className="mx-3 mt-20 xl:mx-8">
        <div className=" flex flex-col  lg:flex-row justify-center  gap-4 w-full p-4 lg:p-8 ">
          <div className="flex text-slate-100  flex-col gap-4 max-h-[900px]  basis-full lg:basis-[40rem]">
            <div className="flex flex-col xs:flex-row flex-wrap xs:items-center gap-2 px-2   h-auto max-w-2xl">
              <h1 className=" text-xl md:text-2xl xl:text-3xl">Thank You</h1>
              <h3 className=" text-slate-100-btn max-w-xl text-xl md:text-2xl xl:text-3xl">
                for your order!
              </h3>
              <img
                className="w-14 p-1 h-14"
                src="https://img.icons8.com/external-smashingstocks-flat-smashing-stocks/66/external-Herbal-Tea-japan-smashingstocks-flat-smashing-stocks.png"
                alt="external-Herbal-Tea-japan-smashingstocks-flat-smashing-stocks"
              />
            </div>

            <div className="flex flex-col gap-1 max-w-xl p-2 h-auto ">
              <p className="text-sm md:text-base">
                Your order is successfully confirmed.
              </p>
              <p className="text-sm md:text-base">
                Your order number is {orderData.orderId}.
              </p>
              <p className="text-sm md:text-base">
                A confirmation email has been sent to {userEmail}.
              </p>
            </div>
            {line}
            <div className="flex flex-col max-w-xl p-2 gap-2 h-auto">
              <p className="text-lg md:text-xl">
                <strong>Shipping Information:</strong>
              </p>
              {!pickupInStore && (
                <p className="text-sm md:text-base">
                  Estimated delivery date:
                  {!pickupInStore && (
                    <b className="font-semibold pl-1">{expectedShipDate}</b>
                  )}
                </p>
              )}
              {!pickupInStore && (
                <div className="flex flex-wrap items-center">
                  <p className="text-sm md:text-base">
                    Your order will be shipped soon.
                  </p>
                  {/*  <img
                  className="w-12 p-1 h-12"
                  src="https://img.icons8.com/color/48/cardboard-box.png"
                  alt="cardboard-box"
                /> */}
                </div>
              )}
              {!pickupInStore ? (
                <p className="text-sm md:text-base ">
                  Once your order is shipped, you will receive an email with
                  detailed shipping information, including tracking details.
                </p>
              ) : (
                <p className="text-sm md:text-base">
                  Once your order is ready for pickup, you will receive an email
                  with detailed pickup information.
                </p>
              )}
            </div>
            {line}
            <div className="flex flex-col gap-1  max-w-xl p-2  h-auto ">
              <p className="text-xs md:text-sm text-balance  xl:text-sm">
                Thank you for choosing our store. We greatly appreciate your
                purchase!
              </p>
              <p className="text-xs md:text-sm text-balance  xl:text-sm">
                If you have any questions or need assistance, feel free to
                contact our customer support.
              </p>
            </div>
            <div className="my-4">
              <ButtonHomepage />
            </div>
          </div>

          <div className="flex  justify-center after:h-full after:w-full lg:after:w-0 after:flex-shrink-0 after:border-b-primary-btn lg:after:border-r-primary-btn after:border-b lg:after:border-r lg:after:border-b-0 after:content-['']"></div>

          <div className="flex gap-1 justify-center basis-full h-full lg:basis-[22rem]  ">
            <OrderSummarySidebar
              pickupInStore={pickupInStore}
              totalOrder={amount}
              discountAmount={discountAmount}
              ship={shipCost}
              orderData={orderData.items}
              count={numbersOfItems}
              subtotal={formatAmount(subtotalOrder)}
              paymentMethod={paidViaCard}
              title="Summary"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col min-h-screen relative">
        <ScrollTopTopButton />
        <>
          <Navbar />
        </>

        <div className="flex-1">
          {isLoading ? (
            <Loader
              text="One moment while we prepare your order details"
              loaderClass="loader"
            />
          ) : (
            <>
              {!orderData && errorMessage ? (
                <div className="mt-20 mx-3 text-sm text-slate-200 flex items-center min-h-20">
                  {errorMessage}
                </div>
              ) : (
                <ConfirmationHeader />
              )}
            </>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};
export default OrderConfirmation;
