import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const FormLayout = ({
  children,
  img,
  alt,
  headline,
  subheadline,
  linkDirect,
  textLink,
  signText,
  actionTitle,
}) => {



  const line = (
    <div className="flex after:w-14 after:flex-shrink-0 after:border-primary-btn after:border after:content-['']"></div>
  );

  const underlineHover = `after:content-[""] after:absolute after:w-full after:h-0.5  after:rounded-br-none after:rounded-bl-none after:bg-primary-btn after:top-full after:left-0 after:hover:transition-transform after:hover:duration-500 after:scale-x-0 after:origin-right after:hover:scale-x-100 after:hover:origin-left hover:opacity-100`;
  const isBigScreen = window.matchMedia("(min-width: 768px)").matches;
  return (
    <motion.div
      initial={
        isBigScreen
          ? {
              opacity: 0,
              y: -50,
            }
          : {}
      }
      animate={isBigScreen ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        type: "sprint",
      }}
      viewport={{ once: true }}
      className=" w-[18.75rem]   xs:max-w-[22rem] md:max-w-[45rem] xs:w-[50rem] lg:min-w-[55.125rem] h-auto lg:min-h-[28.75rem] 2xl:min-h-[50rem] md:max-h-[67.5rem] 2xl:max-w-[65.125rem]  overflow-hidden   m-3 bg-primary flex flex-col rounded-[1.75rem] md:flex-row"
    >
      <motion.div
        className={` w-full relative ${img} bg-cover md:w-1/2  min-h-[28rem] }`}
      >
        <div className="absolute text-balance flex flex-col gap-3 text-base glassForm p-8  top-1/3 md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 xs:w-72 h-50 md:w-80 lg:w-3/4 md:h-3/5">
          <span className=" text-lg md:text-xl">{headline}</span>
          {line}
          <span className="text-xs">{subheadline}</span>

          <div className="text-left flex mt-2 md:mt-auto flex-col text-xs md:text-sm decoration-1">
            {signText}
            <Link
              to={`/${linkDirect}`}
              className={` ${underlineHover} inline-flex  max-w-36 w-full relative font-bold text-base md:text-lg`}
            >
              {textLink}
            </Link>
          </div>
        </div>
      </motion.div>
      <div className=" absolute md:relative w-[18.75rem] xs:w-full xs:max-w-[22rem] md:max-w-full  left-1/2 md:left-auto md:-translate-x-0 -translate-x-1/2  max-h-full overflow-scroll top-[21.75rem] xs:top-80 md:top-auto md:w-1/2 flex flex-col justify-center rounded-[1.75rem]">
        <div className=" flex flex-col w-full  rounded-[1.75rem] bg-primary p-4 xs:p-8 ">
          <div className="flex flex-col gap-1 mb-6 mt-2 ">
            <h1 className=" text-lg lg:text-xl text-center font-bold text-primary-black ">
              {actionTitle}
            </h1>
          </div>
          <div className=" w-full min-w-[16rem] flex flex-col justify-center items-center pb-4 ">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
