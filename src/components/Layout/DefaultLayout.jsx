import React, { useRef, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { Footer } from "../Footer/Footer";
import { ScrollTopTopButton } from "../ScrollTopTopButton";

 const DefaultLayout = () => {
  return (
    <div className="flex flex-col min-h-screen  relative ">
      <ScrollTopTopButton />
      <div className="mb-12 md:mb-12 lg:mb-14">
        <Navbar />
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
      <>
        <Footer />
      </>
    </div>
  );
};

export default DefaultLayout;