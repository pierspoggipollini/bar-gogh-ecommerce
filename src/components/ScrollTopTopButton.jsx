import {
  ArrowUpward,
} from "@mui/icons-material";
import React, { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";

export const ScrollTopTopButton = () => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if ((latest > previous || latest < previous) && latest > 400) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const scrollToTop = () => {
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {hidden ? (
        <motion.div
          key="scroller"
          initial="hidden"
          variants={{
            visible: {
              y: 0,
              transition: {
                type: "spring",
                damping: 10,
                mass: 0.75,
                stiffness: 100,
                duration: 0.6,
              },
            },
            hidden: { y: 100 },
          }}
          exit={{ y: 100, transition: { duration: 0.5 } }}
          animate={hidden ? "visible" : "hidden"}
          className="fixed right-8 bottom-8 z-50"
        >
          <motion.button
            whileHover={{
              scale: 1.1,
              boxShadow: "0px 0px 10px #cacaca",
            }}
            onClick={() => scrollToTop()}
            whileTap={{ scale: 0.75 }}
            className="bg-slate-100 p-2.5 md:p-3 opacity-90 cursor-pointer rounded-lg"
            aria-label="Scroll to top"
            title="Scroll to top"
            role="button"
            aria-haspopup="false"
          >
            <ArrowUpward fontSize="large" />
          </motion.button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
