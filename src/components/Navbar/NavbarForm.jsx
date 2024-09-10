import { KeyboardArrowRightOutlined } from "@mui/icons-material";
import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Logo from "../images/logo/logo.png"
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

export const NavbarForm = () => {
  const [show, setShow] = useState(false); // State to indicate whether the navbar should be shown or hidden

  const { scrollY } = useScroll();

   useMotionValueEvent(scrollY, "change", (latest) => {
     const previous = scrollY.getPrevious();
     const isScrollDown = latest > previous && previous > 150;
     setShow(isScrollDown); // Updates the show state based on scroll direction and position
   });

  return (
    <>
      <motion.div
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={show ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={` z-10 flex h-full w-screen flex-wrap items-center justify-between bg-primary py-1 px-6  text-base transition-all duration-300 ease-linear lg:px-10 `}
      >
        <div
          className="
          order-2 sm:relative  sm:order-1  "
        >
          <Link to="/home">
            <img src={Logo} alt="logo" className="w-20" />
          </Link>
        </div>

        <div className="order-2 flex min-w-fit w-3/5  text-center overflow-hidden items-center gap-2 text-sm hover:text-black-hover  xs:w-auto   ">
          <KeyboardArrowRightOutlined />
          <Link to="/">Back to the homepage</Link>
        </div>
      </motion.div>

      <Outlet />
    </>
  );
};
