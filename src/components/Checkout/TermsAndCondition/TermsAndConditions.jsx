import React, { useState } from "react";
import { CheckboxTerms } from "./CheckboxTerms";
import { Overlay } from "../../Overlay";
import PrivacyPolicy from "../TermsAndCondition/Privacy/PrivacyPolicy"
import TermsOfSale from "../TermsAndCondition/Sale/TermsOfSale"
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

// Definition of the React component named "TermsAndConditions"
export const TermsAndConditions = ({
  onInputChange,
  name,
  checked,
  aria,
  error,
  errorBorder,
}) => {
  // Use of the useState hook to manage the component's state
  const [activeTerms, setActiveTerms] = useState(false);
  const [activePrivacy, setActivePrivacy] = useState(false);

  // Rendering of the component
  return (
    <>
      {/* Main container with Tailwind CSS styling classes */}
      <div
        className={twMerge(
          `flex flex-col items-center w-full h-full py-4  text-slate-800`,
          errorBorder,
        )}
      >
        {/* CheckboxTerms component with some props and a label containing links and buttons */}
        <CheckboxTerms
          onInputChange={onInputChange}
          checked={checked}
          aria={aria}
          label={
            <p className="font-semibold text-xs sm:text-sm">
              {/* Label text with links and buttons that trigger the modals */}I
              confirm that I am at least 16 years old and have read and accepted
              the{" "}
              <motion.button
                whileTap={{ scale: 0.95 }}
                role="button"
                aria-label="Terms of Sale"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTerms(true);
                }}
                className=" decoration-2 underline decoration-primary-btn hover:text-slate-600 "
              >
                Terms of Sale
              </motion.button>{" "}
              and{" "}
              <motion.button
                aria-label="Privacy Policy"
                role="button"
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  setActivePrivacy(true);
                }}
                className=" decoration-2 underline decoration-primary-btn hover:text-slate-600 "
              >
                Privacy Policy
              </motion.button>
            </p>
          }
        />
      </div>
      {/* Display an error message if present */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={error ? { opacity: 1 } : { opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="px-4 pb-1 w-full text-red-700"
        >
          <span className="text-sm">
            {/* Error message suggesting the user to confirm age and accept terms to proceed */}
            Please confirm you're at least 16 years old and have accepted the
            Terms of Sale and Privacy Policy to proceed.
          </span>
        </motion.div>
      )}

      {/* Overlay component and two modals for Terms of Sale and Privacy Policy */}
      <Overlay active={activeTerms || activePrivacy} />

      <TermsOfSale
        openModal={activeTerms}
        closeModal={() => setActiveTerms(false)}
      />
      <PrivacyPolicy
        openModal={activePrivacy}
        closeModal={() => setActivePrivacy(false)}
      />
    </>
  );
};
