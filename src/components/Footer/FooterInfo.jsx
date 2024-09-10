import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { itemVariantsFooter, variantFooter } from "../utilities/variants";
import { KeyboardArrowDownOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";

export const FooterInfo = ({ title, links }) => {
  const [openInfo, setOpenInfo] = useState(false);

  const underlineHover = `after:content-[""] after:absolute after:w-full after:h-1  after:rounded-br-none after:rounded-bl-none after:bg-primary-btn after:top-full after:left-0 after:hover:transition-transform after:hover:duration-500 after:scale-x-0 after:origin-right after:hover:scale-x-100 after:hover:origin-left hover:opacity-100`;
const scrollToSection = (sectionId) => {
  const targetSection = document.getElementById(sectionId);

  if (targetSection && modalRef.current) {
    // Utilizza scrollIntoView con il comportamento smooth e l'allineamento al centro del container del modal
    targetSection.scrollIntoView({
      behavior: "smooth",
      block: "center", // Imposta l'allineamento al centro
      inline: "nearest",
      container: modalRef.current,
    });
  }
};
  return (
    <>
      <motion.div
        animate={openInfo ? "open" : "closed"}
        className="w-full lg:hidden"
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setOpenInfo(!openInfo)}
          className="flex w-full items-center justify-between rounded-sm border-0 py-2 px-2 text-base font-bold uppercase lg:hidden"
          aria-expanded={openInfo ? "true" : "false"}
          aria-label={`Toggle ${title} section`}
        >
          {title}
          <motion.div
            variants={{
              open: { rotate: 180 },
              closed: { rotate: 0 },
            }}
            transition={{ duration: 0.2 }}
            style={{ originY: 0.55 }}
            className="lg:hidden"
          >
            <KeyboardArrowDownOutlined fontSize="large" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {openInfo && (
            <motion.ul
              style={{ pointerEvents: openInfo ? "auto" : "none" }}
              variants={variantFooter}
              initial="closed"
              exit="closed"
              className={`  ${openInfo ? "block" : "hidden"}
             flex cursor-pointer flex-col gap-4 px-2 py-1 text-sm text-primary-black `}
            >
              {links?.map((link, index) => (
                <motion.li
                  className="border-b border-b-slate-800 py-2"
                  key={index}
                  variants={itemVariantsFooter}
                >
                  <Link to={link.link} aria-label={link.name}>
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="hidden max-w-[170px] bg-primary p-2 lg:block">
        <h1 className="text-base font-bold uppercase">{title}</h1>
        <div className="mt-3">
          <ul className="cursor-pointer  grid gap-3 text-sm">
            {links?.map((link, index) => (
              <li
                key={index}
                className={`hover:text-black-hover  relative ${underlineHover}`}
              >
                <a href={link.link} aria-label={link.name}>
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
