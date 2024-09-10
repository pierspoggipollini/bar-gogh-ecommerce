import React from "react";
import { FooterContact } from "./FooterContact";
import { FooterInfo } from "./FooterInfo";
import { FooterNewsletter } from "./FooterNewsletter";
import { CopyrightOutlined } from "@mui/icons-material";
import { motion } from "framer-motion";

export const Footer = () => {
  const infoLinks = [
    { name: "Abous US", link: "/about-us" },
    { name: "Delivery Information", link: "/conditions#LegalPolicy_ShippingAndDelivery" },
    { name: "Privacy Policy", link: "/privacy-policy" },
    { name: "Terms & Conditions", link: "/conditions" },
  ];

  const myAccountLinks = [
    { name: "My Account", link: "/dashboard" },
    { name: "Orders History", link: "/dashboard/my-orders" },
    { name: "Wish List", link: "/dashboard/my-whishlist" },
    { name: "Returns", link: "/dashboard/returns" },
  ];

  return (
    <motion.footer
      initial={{
        opacity: 0,
      }}
      whileInView={{
        opacity: 1,
        transition: {
          duration: 1,
        },
      }}
      viewport={{ once: true }}
      className="grid w-full h-auto min-h-80 lg:h-80 overflow-hidden gap-3 bg-primary px-2 pt-6 lg:grid-cols-6"
    >
      <div className=" lg:col-span-2">
        <FooterContact />
      </div>
      <FooterInfo title="Information" links={infoLinks} />
      <FooterInfo title="My account" links={myAccountLinks} />
      <div className=" md:grid  lg:col-span-2 ">
        <FooterNewsletter />
      </div>
      <div className=" col-span-full py-2 px-2 md:py-4">
        <span className=" text-xs  md:text-sm">
          Powered By Pier Paolo Poggi Pollini{" "}
          <CopyrightOutlined fontSize="sm" /> 2024{" "}
        </span>
      </div>
    </motion.footer>
  );
};
