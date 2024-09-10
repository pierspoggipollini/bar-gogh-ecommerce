import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BillingAddressOptions } from "./BillingAddressOptions";
import * as CheckoutActions from "../../../../store/checkout";
import MessageProvider from "../../../Dashboard/Message/MessageProvider";

// BillingAddress component
export const BillingAddress = () => {
  // Get the dispatch function from the Redux store
  const dispatch = useDispatch();

  // Get shippingData from the Redux store
  const shippingData = useSelector((state) => state.shippingData);
  const { addresses } = shippingData;

  // Effect hook to dispatch the defaultBillingAddress when addresses change
  useEffect(() => {
    // Check if there are addresses and calculate defaultBillingAddress only if present
    if (addresses && addresses.length > 0) {
      const defaultBillingAddress = addresses.find(
        (address) => address.defaultBilling === true,
      );

      // Dispatch the action to add the defaultBillingAddress
      dispatch(CheckoutActions.addBillingAddress(defaultBillingAddress));
    }
  }, [addresses, dispatch]); // Dependency array for the useEffect hook

   const billingAddressSection = useRef();

  return (
    <>
      <div ref={billingAddressSection} className="flex flex-col rounded-lg px-4 py-4 gap-3 bg-slate-100 h-full max-w-full">
        {/* Header section */}
        <motion.div className="max-h-20 w-full flex justify-between items-center">
          <h1 className="text-lg md:text-xl font-bold uppercase text-primary-black">
            Billing Addresses
          </h1>
        </motion.div>

        {/* Render the BillingAddressOptions component */}
        <MessageProvider>
          <BillingAddressOptions billingAddressSection={billingAddressSection} />
        </MessageProvider>
      </div>
      {/* Uncomment the following sections if needed */}
      {/* 
      <div className="h-full bg-slate-200 p-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold uppercase">We Accept:</h3>
          <div className="flex flex-wrap gap-1">
            {Object.entries(cardImages).map(([cardName, cardImage]) => (
              <img
                key={cardName}
                src={cardImage}
                alt={cardName}
                className="w-8 h-8"
              />
            ))}
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            exit="closed"
            variants={containerVariants}
            className="p-4 h-full bg-slate-200"
          >
            <PromoValidity />
          </motion.div>
        )}
      </AnimatePresence>
      */}
    </>
  );
};
