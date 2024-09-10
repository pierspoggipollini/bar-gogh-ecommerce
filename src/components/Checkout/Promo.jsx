import { KeyboardArrowDownOutlined } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { PromoValidity } from "../Promotionals/PromoValidity";

export const Promo = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Variants for container animation
  const containerVariants = {
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "tween",
        staggerChildren: 0.1,
      },
    },
    closed: {
      scale: 0.5,
      opacity: 0,
      y: -50,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="flex max-h-72 flex-col max-w-full">
      {/* Container for the promotion header */}
      <motion.div
        animate={isOpen ? "open" : "closed"}
        initial="closed"
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className={`bg-slate-100 ${isOpen ? "rounded-t-lg" : "rounded-lg"} h-14 p-4 cursor-pointer w-full flex justify-between items-center`}
      >
        {/* Promotion header */}
        <h1 className=" text-lg md:text-xl font-bold uppercase  text-primary-black">
          Promotions
        </h1>
        {/* Arrow icon for indicating open/close state */}
        <motion.div
          variants={{
            open: { rotate: 180 },
            closed: { rotate: 0 },
          }}
          transition={{ duration: 0.2 }}
        >
          <KeyboardArrowDownOutlined sx={{ fontSize: "2.25rem" }} />
        </motion.div>
      </motion.div>

      {/* Container for promotion details */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed" // Initial state (closed)
            animate={isOpen ? "open" : "closed"}
            exit="closed"
            variants={containerVariants}
            className="p-4 rounded-b-lg h-full bg-slate-100"
          >
            {/* Component for displaying promotion validity */}
            <PromoValidity />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
