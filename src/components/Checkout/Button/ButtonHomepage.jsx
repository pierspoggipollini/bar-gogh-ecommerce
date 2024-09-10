import React from 'react'
import "./buttonHomepage.css"
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';

export const ButtonHomepage = () => {
    const navigate = useNavigate()
  return (
    <>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/home")}
        className="learn-more"
      >
        <span aria-hidden="true" className="circle">
          <span className="icon arrow"></span>
        </span>
        <span className="button-text  ">Go to homepage</span>
      </motion.button>
    </>
  );
}
