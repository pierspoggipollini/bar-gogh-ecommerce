import React, { useRef } from 'react'
import { motion } from 'framer-motion';
import { ArrowDownwardRounded } from '@mui/icons-material';
import Breadcrumb from '../../BreadCrumb';

const InfoLayout = ({firstTitle, secondTitle, children }) => {
  const ourStory = useRef();

  const moveDown = () => {
    ourStory.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="h-[18.75rem] z-0   flex flex-col items-center uppercase gap-8 justify-center">
        <div className="absolute inset-0 max-h-[20.625rem] bg-gradient-to-r from-neutral-300 to-stone-400 bg-center bg-cover bg-no-repeat filter blur-lg z-0"></div>

        <div className="flex gap-2 relative  text-4xl md:text-5xl items-center">
          <span className="text-slate-700">{firstTitle}</span>
          <span className="text-primary-btn">{secondTitle}</span>
        </div>

        <div className=" flex items-center justify-center">
          <motion.button
            animate={{
              y: [0, -10, 0], // Sequence of y values to create the jump effect
              transition: {
                duration: 2, // Duration for the entire animation sequence
                repeat: Infinity, // Repeat the animation infinitely
                ease: "easeInOut", // Easing function for smooth animation
              },
            }}
            whileTap={{ scale: 0.9 }}
            onClick={moveDown}
            className="p-2 w-16 h-16 hover:brightness-110 hover:transition-all rounded-full bg-primary-btn"
          >
            <span className="flex justify-center">
              <ArrowDownwardRounded />
            </span>
          </motion.button>
        </div>
      </div>

      <div ref={ourStory} className="grid gap-10 mx-3 mb-10">
        {children}
      </div>
    </>
  );
};

export default InfoLayout