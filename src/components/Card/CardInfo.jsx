import React from "react";
import { motion } from "framer-motion";

export const CardInfo = ({ icon, title, info }) => {
  const boxShadow = "rounded-md bg-primary shadow-xl ";

  return (
    <motion.div
     
      className={`${boxShadow} md:basis-50 mb-3 flex shrink-0 grow-0 basis-56 cursor-default
         snap-center snap-always items-center px-4 py-2 min-h-24 max-h-32 xs:basis-80 lg:basis-72 xl:basis-80 2xl:basis-1/5  `}
    >
      {icon}
      <div className="grid gap-1 pl-3">
        <span className=" text-base font-bold uppercase">{title}</span>
        <span className=" text-sm">{info}</span>
      </div>
    </motion.div>
  );
};
