import { KeyboardArrowDownOutlined } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { updateCountry } from "../../../store/shippingData";
import { useDispatch, useSelector } from "react-redux";
import { CountrySelect } from "./CountrySelect";
import { getData } from "country-list";
import { TabsCheckout } from "./TabsCheckout";

export const ShipOptions = () => {
  const countriesData = getData();

  const dispatch = useDispatch();

  return (
    <div className="flex flex-col h-full   max-w-full">
      <motion.div className="bg-slate-100 rounded-t-lg max-h-20 p-4  w-full flex justify-between items-center">
        <h1 className=" text-lg md:text-xl font-bold uppercase  text-primary-black">
          Shipping Options or Pickup
        </h1>

       
      </motion.div>
      <div className="h-full rounded-b-lg bg-slate-100 p-4">
        <TabsCheckout />
      </div>
      {/*  <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed" // Stato iniziale (chiuso)
            animate={isOpen ? "open" : "closed"}
            exit="closed"
            variants={containerVariants}
            className=" p-4  h-full  bg-slate-200"
          >
            <PromoValidity />
          </motion.div>
        )}
      </AnimatePresence> */}
    </div>
  );
};
