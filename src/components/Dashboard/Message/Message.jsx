import {
  Close,
  CloseOutlined,
} from "@mui/icons-material";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Overlay } from "../../Overlay";
import { useMessageContext } from "./MessageContext";

export const Message = ({
}) => {

  const {
    isNotificationVisible,
    setIsNotificationVisible,
    showSuccessMessage,
    showErrorMessage,
    clearMessages,
    text,
  } = useMessageContext()

  const SuccessSVG = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="25"
      height="30"
      viewBox="0 0 48 48"
    >
      <path
        fill="#4caf50"
        d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
      ></path>
      <path
        fill="#ccff90"
        d="M34.602,14.602L21,28.199l-5.602-5.598l-2.797,2.797L21,33.801l16.398-16.402L34.602,14.602z"
      ></path>
    </svg>
  );

  const ErrorSVG = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="30"
      height="40"
      viewBox="0 0 300 250"
      
    >
      <g
        fill="#fa5252"
        fill-rule="nonzero"
        stroke="none"
        stroke-width="1"
        stroke-linecap="butt"
        stroke-linejoin="miter"
        stroke-miterlimit="10"
        stroke-dasharray=""
        stroke-dashoffset="0"
        font-family="none"
        font-weight="none"
        font-size="none"
        text-anchor="none"
        
      >
        <g transform="scale(5.33333,5.33333)">
          <path d="M24,4c-11.046,0 -20,8.954 -20,20c0,11.046 8.954,20 20,20c11.046,0 20,-8.954 20,-20c0,-11.046 -8.954,-20 -20,-20zM31.561,29.439c0.586,0.586 0.586,1.535 0,2.121c-0.293,0.294 -0.677,0.44 -1.061,0.44c-0.384,0 -0.768,-0.146 -1.061,-0.439l-5.439,-5.44l-5.439,5.439c-0.293,0.294 -0.677,0.44 -1.061,0.44c-0.384,0 -0.768,-0.146 -1.061,-0.439c-0.586,-0.586 -0.586,-1.535 0,-2.121l5.44,-5.44l-5.439,-5.439c-0.586,-0.586 -0.586,-1.535 0,-2.121c0.586,-0.586 1.535,-0.586 2.121,0l5.439,5.439l5.439,-5.439c0.586,-0.586 1.535,-0.586 2.121,0c0.586,0.586 0.586,1.535 0,2.121l-5.439,5.439z"></path>
        </g>
      </g>
    </svg>
  );

  return (
    <>
      <AnimatePresence>
        {isNotificationVisible && (
          <div className="mb-2">
            <div className=" md:hidden  fixed inset-0  z-10 flex max-w-full mx-3  items-center justify-center">
              <Overlay active={text.confirm || text.error} />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.2 } }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.2, type: "tween" },
                }}
                key="modal"
                className={` ${
                  text.confirm ? "bg-slate-100" : text.error ? "bg-red-400" : ""
                } relative z-10   flex min-h-36 max-w-xs w-full p-8  rounded-lg shadow-lg`}
              >
                <div className="flex w-full flex-col items-center justify-center gap-3 ">
                  <motion.span className="p-2">
                    {text.confirm ? (
                      <SuccessSVG />
                    ) : text.error ? (
                      <ErrorSVG />
                    ) : null}
                  </motion.span>
                  <motion.span
                    className={`max-w-xs text-center text-sm lg:text-base lg:max-w-sm ${text.confirm ? "text-green-800" : "text-red-700"} overflow-x-auto`}
                  >
                    {text.confirm ? text.confirm : text.error ? text.error : ""}
                  </motion.span>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    role="button"
                    aria-label="Close"
                    name="Close"
                    onClick={() => {
                      setIsNotificationVisible(false);
                    }}
                    className="absolute p-2 hover:bg-slate-300 hover:rounded-full right-3 top-2 cursor-pointer"
                  >
                    <Close fontSize="medium" className="hover:text-slate-700" />
                  </motion.button>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }} // Start from hidden position below (or any desired height)
              animate={{ opacity: 1 }} // Move to bottom: 0
              exit={{ opacity: 0 }} // When exiting, move back down
              key="message"
              transition={{ duration: 0.3, type: "tween" }}
              className={`${
                text.confirm ? "bg-slate-100" : text.error ? "bg-red-400" : ""
              } hidden h-16  rounded-lg px-4 w-full md:flex items-center gap-2 relative text-slate-900`}
            >
              <motion.span className="p-2">
                {text.confirm ? <SuccessSVG /> : text.error ? <ErrorSVG /> : null}
              </motion.span>
              <motion.span className="max-w-xs text-sm lg:text-base lg:max-w-sm overflow-x-auto">
                {text.confirm ? text.confirm : text.error ? text.error : ""}
              </motion.span>
              <motion.button
                role="button"
                aria-label="Close"
                name="Close"
                className="absolute hover:bg-slate-200 rounded-full right-3 top-1 p-1"
                onClick={() => {
                  setIsNotificationVisible(false);
                }}
              >
                <CloseOutlined />
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
