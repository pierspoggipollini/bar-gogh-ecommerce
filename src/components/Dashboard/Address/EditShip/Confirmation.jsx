import { Close } from "@mui/icons-material";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Overlay } from "../../../Overlay";

export const Confirmation = ({
  showConfirmation,
  title,
  advice,
  label,
  sendRemoval,
  cancel,
}) => {
  return (
    <>
      <AnimatePresence>
        {showConfirmation && (
          <div className="  fixed rounded-lg inset-0 z-[60] flex max-w-full mx-2 items-center justify-center">
            <Overlay active={true} />
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.3 } }}
              exit={{
                opacity: 0,
                scale: 1,
                transition: { duration: 0.1, type: "tween" },
              }}
              key="modal"
              className="relative z-10 flex h-auto w-[21rem]  rounded-md bg-gradient-to-tr from-gray-100 to-gray-300 py-8 px-4 shadow-lg"
            >
              <div className="flex w-full mt-6 flex-col items-center justify-center gap-4 ">
                <h1 className="text-lg font-semibold uppercase">{title}</h1>
                <span className="text-center text-sm/none text-slate-700 leading-relaxed">
                  {advice}
                </span>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={sendRemoval}
                  role="button"
                  title="Delete"
                  aria-label={`Delete ${label}`}
                  className=" w-full bg-primary-black hover:bg-black-hover font-semibold p-3 text-slate-100 text-center rounded-lg uppercase"
                >
                  Delete
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={cancel}
                  role="button"
                  title="Cancel"
                  aria-label={`Cancel Removal ${label}`}
                  className=" w-full bg-slate-400/60 border border-slate-500  hover:bg-slate-300 text-primary-black font-semibold p-3  rounded-lg text-center uppercase"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={cancel}
                  role="close"
                  title="close"
                  aria-label="close modal"
                  className="absolute hover:bg-slate-300 rounded-full p-1 right-5 top-5 cursor-pointer"
                >
                  <Close fontSize="medium" className="hover:text-slate-700" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
