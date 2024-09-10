import { CircularProgress } from "@mui/material";
import React from "react";
import { motion } from "framer-motion";

export const FormButton = ({
  isSubmitting,
  ariaLabel,
  isSubmitSuccessful,
  action,
  loadingText,
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      role="button"
      title={ariaLabel}
      type="submit"
      aria-label={ariaLabel}
      disabled={isSubmitting || isSubmitSuccessful}
      className="flex w-full  h-10 max-h-12 cursor-pointer items-center font-semibold justify-center gap-2 rounded-sm bg-primary-btn p-4 uppercase text-primary-black hover:bg-primary-hover"
    >
      {isSubmitting && <CircularProgress size={20} color="inherit" />}
      {isSubmitting ? loadingText : isSubmitSuccessful ? "Success" : action}
    </motion.button>
  );
};
