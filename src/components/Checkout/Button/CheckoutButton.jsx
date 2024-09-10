
import { Check, House } from '@mui/icons-material';
import React, { useEffect, useState } from "react";
import "./checkoutButton.css"
import loader from "../../../assets/loading.svg"
import { motion } from 'framer-motion';
// Definition of the React component named "CheckoutButton"
export const CheckoutButton = ({ icon, saveFunction, disabled }) => {

  // State to manage the "adding in progress" and "added" states
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Handles the click on the "Complete Purchase" button
  const handleClick = async (event) => {
    event.preventDefault();
    event.stopPropagation(); // Stops event propagation to parents

    // Sets the "adding in progress" state
    setIsSaving(true);

    try {
      // Calls the provided saveFunction asynchronously
      const result = await saveFunction(event);

      // Execute the timeout only if result is true
      if (result) {
        setIsSaving(false);
      } else {
        setIsSaving(false);
        return;
      }
    } catch (error) {
      console.error("Error while submitting:", error);
      setIsSaving(false);
      return;
    }
  };

  return (
    <>
      <div className='flex min-w-full xl:min-w-[20rem]'>
        {/* "Complete Purchase" button with conditional styles based on isSaving state */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          title="Complete Purchase"
          aria-label="Complete Purchase"
          onClick={handleClick}
          disabled={isSaving}
          className={`button ${isSaving && "disabled:opacity-50"}`}
        >
          {isSaving ? (
            // Display loader icon when saving is in progress
            <img src={loader} alt='loader' />
          ) : (
            // Display the provided icon when not saving
            <span className="icon">{icon}</span>
          )}
          {/* Display text based on the saving state */}
          <span className=" text-nowrap uppercase text-base font-semibold">
            {isSaving ? "Processing..." : "Complete Purchase"}
          </span>
        </motion.button>
      </div>
    </>
  );
}
