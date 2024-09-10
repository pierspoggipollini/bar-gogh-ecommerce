import React, { useState } from 'react'
import { motion, useMotionValueEvent } from 'framer-motion';
import { CloseOutlined } from '@mui/icons-material';


export const TermsHeader = ({ title, lastUpdate,  closeModal }) => {

  return (
    <>
      <motion.div
        className="flex sticky top-0 py-3 px-4 shadow-lg bg-slate-100 gap-1 rounded-t-lg  flex-col"
        role="banner"
        aria-label="Header"
      >
        <div
          className="text-[15px] font-semibold"
          role="heading"
          aria-level="1"
        >
          Bargogh
        </div>
        <h2
          className="text-lg uppercase font-bold"
          role="heading"
          aria-level="2"
        >
          {title}
        </h2>
        <span className="-order-1 text-slate-500 text-[13px]" role="status">
          {lastUpdate}
        </span>
        {closeModal && (
          <div
            onClick={closeModal}
            className="absolute p-2 top-3 right-4 lg:hover:bg-slate-300 rounded-full  cursor-pointer"
            role="button"
            aria-label="Close Modal"
          >
            <CloseOutlined />
          </div>
        )}
      </motion.div>
    </>
  );
};

