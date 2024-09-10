import React from "react";
import "./LoaderUser.css";
import "./Loader.css";
import "./coffee.css";
import Logo from "../images/logo/logo.png"

export const Loader = ({ text, secondText, loaderClass }) => {
  return (
    <div
      className="w-full h-screen relative  flex flex-col justify-center items-center bg-gradient-to-r from-gray-100 to-gray-300"
      role="status"
      aria-live="polite"
    >
      <img
        src={Logo}
        alt="logo"
        className={` -translate-y-14 w-28 `}
        aria-hidden="true"
      />
      <div
        className="  mx-6 glassPrimary flex flex-col items-center justify-center  rounded-md min-h-72 p-10 "
        role="alert"
      >
        <div className={`${loaderClass} mb-8`} aria-busy="true">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <span className="text-center text-pretty " aria-label={text}>
          {text}
        </span>
        {secondText && (
          <span
            className="text-center mt-3 text-pretty "
            aria-label={secondText}
          >
            {secondText}
          </span>
        )}
      </div>
    </div>
  );
};
