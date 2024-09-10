import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const Header = () => {
  const textTitle = "Herbal Teas For Wellness".split(" ");
  const textDesc =
    "Discover our unique herbal tea collection, crafted to enhance your health and well-being.".split(
      " ",
    );
  const navigate = useNavigate();
  return (
    <>
      <header
        className="
        flex h-[500px] items-center justify-center bg-hero-mobile bg-cover bg-center  bg-no-repeat  sm:bg-hero-desk  md:mt-0  md:h-[630px]"
      >
        <div className="flex w-full mx-6 flex-col items-center gap-3 rounded-md bg-primary/70 p-5  text-center text-primary-black  backdrop-invert backdrop-opacity-5 sm:max-w-lg lg:max-w-[50rem]">
          <div className="w-full">
            {textTitle.map((el, i) => (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.2,
                  delay: i / 10,
                }}
                key={i}
                className="text-xl font-semibold sm:text-3xl  lg:text-5xl "
              >
                {el}{" "}
              </motion.span>
            ))}
          </div>
          <div className="max-w-md">
            {textDesc.map((el, i) => (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.25,
                  delay: textTitle.length / 10 + i / 10,
                }}
                key={i}
                className="lg:text-base text-balance text-sm"
              >
                {el}{" "}
              </motion.span>
            ))}
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            initial={{
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
              transition: {
                duration: 0.5,
                delay: textDesc.length / 10,
              },
            }}
            viewport={{ once: true }}
            onClick={() => navigate("/products/category/all")}
            className="mt-3 uppercase font-semibold min-w-36 max-w-full cursor-pointer rounded-md bg-primary-btn p-3 text-base text-primary-black hover:bg-primary-hover"
          >
            Shop Now
          </motion.button>
        </div>
      </header>
    </>
  );
};
