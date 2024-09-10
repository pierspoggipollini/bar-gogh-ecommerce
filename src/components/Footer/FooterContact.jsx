import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SocialIcon } from "react-social-icons";
import { variantFooter, itemVariantsFooter } from "../utilities/variants";
import { KeyboardArrowDownOutlined } from "@mui/icons-material";
import ContactInfoData from "./ContactInfoData";




export const FooterContact = () => {
  const [openContact, setOpenContact] = useState(false);

  return (
    <>
      <motion.div
        initial={false}
        animate={openContact ? "open" : "closed"}
        className={` w-full lg:hidden`}
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setOpenContact(!openContact)}
          className="flex w-full items-center justify-between rounded-sm py-1 px-2 text-base font-bold uppercase lg:hidden "
        >
          Contact info
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
          {openContact && (
            <motion.div
              className={``}
              variants={variantFooter}
              exit="closed"
              initial="closed"
            >
              <motion.ul
                style={{ pointerEvents: openContact ? "auto" : "none" }}
                className="flex flex-col gap-2 p-2 text-sm text-primary-black"
              >
                {ContactInfoData.map((data) => (
                  <motion.li key={data.category} variants={itemVariantsFooter}>
                    {data.category}: {data.value}
                  </motion.li>
                ))}
              </motion.ul>

              <motion.ul className="  flex flex-row gap-2 p-2">
                <motion.li variants={itemVariantsFooter}>
                  <SocialIcon
                    network="facebook"
                    style={{ height: 45, width: 45 }}
                  />
                </motion.li>
                <motion.li variants={itemVariantsFooter}>
                  {" "}
                  <SocialIcon
                    network="instagram"
                    style={{ height: 45, width: 45 }}
                  />
                </motion.li>
                <motion.li variants={itemVariantsFooter}>
                  {" "}
                  <SocialIcon
                    network="pinterest"
                    style={{ height: 45, width: 45 }}
                  />
                </motion.li>
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="hidden w-auto bg-primary p-3  lg:block">
        <h1 className="font-bold uppercase">Contact info</h1>
        <motion.div className="bg-primary ">
          <motion.ul className=" mt-2 flex flex-col gap-2 bg-primary pt-1 text-sm text-primary-black">
            {ContactInfoData.map((data) => (
              <motion.li key={data.category} variants={itemVariantsFooter}>
                {data.category}: {data.value}
              </motion.li>
            ))}
          </motion.ul>

          <motion.ul className="flex cursor-pointer flex-row gap-3 pt-4">
            <motion.li>
              <SocialIcon
                network="facebook"
                style={{ height: 45, width: 45 }}
              />
            </motion.li>
            <motion.li>
              {" "}
              <SocialIcon
                network="instagram"
                style={{ height: 45, width: 45 }}
              />
            </motion.li>
            <motion.li>
              {" "}
              <SocialIcon
                network="pinterest"
                style={{ height: 45, width: 45 }}
              />
            </motion.li>
          </motion.ul>
        </motion.div>
      </div>
    </>
  );
};
