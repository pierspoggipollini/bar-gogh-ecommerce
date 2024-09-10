import { useMotionValueEvent, useScroll } from "framer-motion";
import React, { useRef, useState } from "react";
import { accountVariant } from "../utilities/variants";
import { motion, AnimatePresence } from "framer-motion";
import { TermsHeader } from "../Checkout/TermsAndCondition/TermsHeader";
import { privacyPolicySections } from "../Checkout/TermsAndCondition/Privacy/privacyPolicySections";
import Breadcrumb from "../../BreadCrumb";

const PrivacyPolicyPage = ({ openModal, closeModal }) => {
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
    <>
      <Breadcrumb />
      <motion.div
        ref={modalRef}
        initial={{
          opacity: 0,
        }}
        whileInView={{
          opacity: 1,
        }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className=" grid mx-3 my-6 place-content-center  overflow-y-auto  z-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
      >
        <motion.div className="bg-slate-100 rounded-lg max-w-[55rem] ">
          <TermsHeader
            title="Privacy Policy"
            lastUpdate="Last update: January 2024"
            closeModal={closeModal}
          />

          <div className="p-4 grid gap-3 z-0">
            <div className={`grid gap-3 text-xs ${breakLine}`}>
              {privacyPolicySections[0].paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className={`mt-2 grid gap-3 text-slate-900 ${breakLine}`}>
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
                {privacyPolicySections.slice(1).map((section, sectionIndex) => (
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
              {privacyPolicySections.slice(1).map((section, sectionIndex) => (
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
                  ml-8 my-4 text-xs grid gap-3
                  ${
                    sectionIndex === privacyPolicySections.length - 2
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
                        <span>{`${sectionIndex + 1}.${paragraphIndex + 1}`}</span>
                        <span>{paragraph}</span>
                      </motion.li>
                    ))}
                  </ol>
                </React.Fragment>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default PrivacyPolicyPage;
