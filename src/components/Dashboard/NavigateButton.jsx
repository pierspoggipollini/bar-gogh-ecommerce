import React from 'react'
import "./navigateButton.css"
import { useNavigate } from "react-router-dom"; // Assuming you are using React Router for navigation
import { motion } from "framer-motion"; // Assuming you are using Framer Motion for animations

export const NavigateButton = ({ to, title, openInNewTab = false }) => {
  const navigate = useNavigate(); // React Router hook for navigation

  // Function to open link in a new tab
  const openInNewTabHandler = (url) => {
    const newWindow = window.open(url, "_blank");
    newWindow.focus();
  };

  // Click handler for the button
  const handleClick = () => {
    if (openInNewTab) {
      openInNewTabHandler(to); // Open in new tab if openInNewTab is true
    } else {
      navigate(to); // Navigate to the specified route using React Router
    }
  };

  return (
    <>
      {/* Button component with motion animation */}
      <motion.button
        whileTap={{ scale: 0.95 }} // Animation effect when button is tapped
        role="button" // ARIA role for accessibility
        aria-label={title} // ARIA label for accessibility
        onClick={handleClick} // Click handler
        className="navigate relative" // CSS class for styling
      >
        {/* Circle background for button */}
        <span aria-hidden="true" className="circle box">
          <span className="icon arrowRight"></span> {/* Arrow icon */}
        </span>
        <span className="button-text">{title}</span> {/* Button text */}
      </motion.button>
    </>
  );
};

