import React, { useState } from "react";
import "../../../Cart/CartButton/CartButton.css"
import {
  Check,
  DeleteForeverOutlined,
} from "@mui/icons-material";
import {  useNavigate } from "react-router";
import { motion } from "framer-motion";

export const RemoveShippingInfoButton = ({ disabled, remove, returnPath }) => {
  const [isRemoved, setIsRemoved] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRemove = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // Start the removal process
      setIsRemoving(true);
      // Call the remove function
      await remove();

      // Clear any previous error
      setError("");
      // Set a timeout to update the state after the removal process is completed
      setTimeout(() => {
        setIsRemoving(false);
        setIsRemoved(true);
        setTimeout(() => {
          setIsRemoved(false);
          navigate(-1);
        }, 2500);
      }, 800);

      // Redirect to the addresses dashboard after a successful removal
      /* setTimeout(() => navigate("/dashboard/addresses"), 2600); */
    } catch (error) {
      console.log(error);
      // If an error occurs during removal, handle it
      setIsRemoving(false);
      setIsRemoved(false);
      setError("Failed to delete address. Please try again.");
    }
  };

  return (
    <>
      {/* Button for removing the address */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        aria-label="Remove Address" // Accessibility label describing the action
        role="button" // Explicitly specify the role as a button
        onClick={handleRemove}
        disabled={isRemoving || disabled}
        // Dynamic class names based on state for styling
        className={`w-full flex justify-center items-center gap-3 cursor-pointer  hover:bg-slate-300 text-primary-black font-semibold p-3  rounded-lg text-center uppercase ${
          disabled
            ? "disabled:opacity-50 disabled:hover:bg-slate-100 disabled:cursor-not-allowed  disabled:border-slate-300"
            : "disabled:opacity-75 disabled:hover:bg-slate-100  disabled:cursor-not-allowed disabled:border-slate-300"
        }  border-2 border-slate-400  ${
          isRemoving || isRemoved ? "sending" : ""
        }`}
      >
        {/* Icon to indicate the action */}
        <span className="icon">
          {isRemoved ? (
            <Check /> // Checkmark icon if the address is removed
          ) : (
            <DeleteForeverOutlined sx={{ fontSize: "1.8rem" }} /> // Delete icon if not removed yet
          )}
        </span>

        {/* Text indicating the current state of the button */}
        <span className="text">
          {isRemoving
            ? "Removing..." // Display while the removal process is ongoing
            : isRemoved
              ? "Removed" // Display after successful removal
              : "Remove Address"}{" "}
        </span>
      </motion.button>
      {/* Display error message if removal fails */}
      {error && <span className="w-full text-red-500 -mt-6">{error}</span>}
    </>
  );
};
