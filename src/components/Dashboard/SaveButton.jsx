import { Check } from '@mui/icons-material';
import "../Cart/CartButton/CartButton.css";
import React, { useState } from "react";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';

export const SaveButton = ({ isFormValid, icon, saveFunction, disabled }) => {
  // State to manage "saving in progress" and "saved" states
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const navigate = useNavigate(); // React Router hook for navigation

  // Handles the click on the "Save" button
  const handleClick = async (event) => {
    event.preventDefault();
    event.stopPropagation(); // Stops event propagation to parent elements

    // Sets the "saving in progress" state
    setIsSaving(true);

    try {
      // Call the save function (e.g., API call to save data)
      const result = await saveFunction(event);

      // Perform timeout and state updates if saving was successful (result is truthy)
      if (result) {
        const timeout = setTimeout(() => {
          setIsSaving(false);
          setIsSaved(true);
          setTimeout(() => {
            setIsSaved(false);
            navigate(-1); // Navigate back (assuming -1 is a valid navigation action)
          }, 2300); // Timeout to reset "saved" state after 2.3 seconds
        }, 500); // Delay before showing "Saved" state

        // Clean up timeout function to prevent memory leaks
        return () => clearTimeout(timeout);
      } else {
        // Reset states if save function did not succeed
        setIsSaved(false);
        setIsSaving(false);
        return;
      }
    } catch (error) {
      console.error("Error while submitting:", error);
      // Reset states in case of an error
      setIsSaved(false);
      setIsSaving(false);
      return;
    }
  };

  return (
    <>
      {/* Button component with motion animation */}
      <motion.button
        whileTap={{ scale: 0.95 }} // Animation effect when button is tapped
        role="button" // ARIA role for accessibility
        title="Save the address" // Tooltip title
        aria-label="Save the address" // ARIA label for accessibility
        onClick={handleClick} // Click handler
        disabled={isSaving || !isFormValid || disabled} // Disable button based on conditions
        className={`saving-button ${isSaving || isSaved ? "sending" : ""} ${isSaving && "disabled:opacity-50"}`}
      >
        <span className="icon">{isSaved ? <Check /> : icon}</span>{" "}
        {/* Icon or check mark for success */}
        <span className="text">
          {isSaving ? "Saving..." : isSaved ? "Saved" : "Save"}{" "}
          {/* Button text based on state */}
        </span>
      </motion.button>
    </>
  );
};



