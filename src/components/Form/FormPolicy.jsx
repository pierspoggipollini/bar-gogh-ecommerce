import React, { useState } from 'react'
import { twMerge } from 'tailwind-merge';
import FormCheckbox from './FormCheckbox';
import { motion } from 'framer-motion';
import PrivacyPolicy from '../Checkout/TermsAndCondition/Privacy/PrivacyPolicy';
import { Overlay } from '../Overlay';

const FormPolicy = ({ errorBorder, register, name, error }) => {

  const [activePrivacy, setActivePrivacy] = useState(false);

  return (
    <>
      {/* Main container with Tailwind CSS styling classes */}
      <div
        className={twMerge(
          `flex flex-col items-center w-full h-full mb-2 text-slate-800`,
          errorBorder,
        )}
      >
        {/* FormCheckbox component with some props and a label containing links and buttons */}
        <FormCheckbox
          register={register}
          name={name}
          action={
            <p className="font-semibold text-xs sm:text-sm">
              {/* Label text with links and buttons that trigger the modals */}I
              confirm that I am at least 16 years old and have read and accepted
              the{" "}
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
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={error ? { opacity: 1 } : { opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="w-full mt-1  text-red-700"
          >
            <span className="text-xs">
              {/* Error message suggesting the user to confirm age and accept terms to proceed */}
              {error}
            </span>
          </motion.div>
        )}
      </div>
      {/* Display an error message if present */}

      {/* Overlay component and two modals for Terms of Sale and Privacy Policy */}
      <Overlay active={activePrivacy} />

      <PrivacyPolicy
        openModal={activePrivacy}
        closeModal={() => setActivePrivacy(false)}
      />
    </>
  );
};

export default FormPolicy