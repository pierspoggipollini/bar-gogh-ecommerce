import React, { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { accountVariant } from "../../../utilities/variants";
import { TermsHeader } from "../TermsHeader";
import { termsOfSaleSection } from "./termsOfSaleSection";

const TermsOfSale = ({ openModal, closeModal }) => {
  const modalRef = useRef(null);

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

  const breakLine = `after:h-2 after:flex-1 after:flex after:flex-shrink-0 after:border-b-2 after:border-solid after:border-slate-300 after:my-3 after:content-['']`;

  return (
    <AnimatePresence>
      {openModal && (
        <motion.div
          ref={modalRef}
          variants={accountVariant}
          initial="closed"
          animate={openModal ? "open" : "closed"}
          exit="closed"
          className=" grid fixed  place-items-center  inset-x-8 inset-y-6  overflow-y-auto rounded-md z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalTitle"
        >
          <motion.div className="bg-slate-100 rounded-lg max-w-lg ">
            <TermsHeader
              title="Terms Of Sale"
              lastUpdate="Last update: December 2023"
              closeModal={closeModal}
            />

            <div
              className={` z-0 p-4 mt-2 grid gap-3 text-slate-900 ${breakLine} `}
            >
              <h3
                className="font-semibold uppercase"
                id="modalTitle"
                role="heading"
                aria-level="3"
              >
                Index
              </h3>
              <motion.ol
                className="text-sm text-slate-900 grid gap-3 mx-6"
                start={1}
              >
                {termsOfSaleSection.map((section, sectionIndex) => (
                  <motion.li className="flex gap-4" key={sectionIndex}>
                    <span className="w-3">{sectionIndex + 1}.</span>
                    <a
                      className="underline cursor-pointer underline-offset-1"
                      onClick={() =>
                        scrollToSection(`LegalPolicy_${section.link}`)
                      }
                    >
                      {section.title}
                    </a>
                  </motion.li>
                ))}
              </motion.ol>
            </div>

            <div className="text-slate-900 pb-2">
              {termsOfSaleSection.map((section, sectionIndex) => (
                <React.Fragment key={sectionIndex}>
                  <motion.div className="flex gap-4 mx-6">
                    <span className="w-4">{sectionIndex + 1}.</span>
                    <h2
                      className="uppercase font-semibold"
                      role="heading"
                      aria-level="4"
                    >
                      {section.title}
                    </h2>
                  </motion.div>
                  <ol
                    className={`
                  ml-8 my-4  text-xs grid gap-3
                  ${
                    sectionIndex === termsOfSaleSection.length - 1
                      ? "pb-4" // Non aggiungere "after" all'ultimo elemento
                      : "after:my-6 after:h-2 after:flex-1 after:flex after:flex-shrink-0 after:border-b-2 after:border-solid after:border-slate-300 after:content-['']"
                  }
                `}
                  >
                    {section.paragraphs.map((paragraph, paragraphIndex) => (
                      <motion.li
                        key={paragraphIndex}
                        id={`LegalPolicy_${section.link}`}
                        className="flex mx-6 gap-3"
                      >
                        <span>
                          {`${sectionIndex + 1}.${paragraphIndex + 1}`}
                        </span>
                        <span>{paragraph}</span>
                      </motion.li>
                    ))}
                  </ol>
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TermsOfSale;
