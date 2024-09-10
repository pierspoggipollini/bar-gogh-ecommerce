import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export const UpdatedNotification = ({ action, message }) => {
  const [isRemoved, setIsRemoved] = useState(false);

  // Effect to trigger notification display when item is removed
  useEffect(() => {
    if (action) {
      setIsRemoved(true);
      setTimeout(() => {
        setIsRemoved(false);
      }, 1500); // Close the notification after a certain period of time
    }
  }, [action]);

  // Variants for the notification animation
  const exitVariants = {
    hidden: {
      opacity: 0,
      y: -50, // Move the element upwards
    },
    visible: {
      opacity: 1,
      y: 0, // Return the element to its original position
      transition: {
        duration: 0.5, // Set the animation duration
      },
    },
    exit: {
      opacity: 0,
      y: 50, // Move the element downwards
      transition: {
        duration: 0.5, // Set the animation duration
      },
    },
  };

  return (
    <AnimatePresence>
      {isRemoved && (
        // Notification component with animation
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={exitVariants}
          className="bg-[conic-gradient(at_left,_var(--tw-gradient-stops))] z-0 w-full from-slate-200 to-slate-300 rounded-lg flex justify-center my-2"
          // Aria attributes for accessibility
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="  w-full p-2 flex justify-center rounded-sm">
            <span className="text-sm text-green-800 leading-relaxed">
             {message}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

