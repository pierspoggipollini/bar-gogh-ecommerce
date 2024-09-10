import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TermsHeader } from "../Checkout/TermsAndCondition/TermsHeader";
import { termsOfSaleSection } from "../Checkout/TermsAndCondition/Sale/termsOfSaleSection";
import { useLocation } from "react-router";
import Breadcrumb from "../../BreadCrumb";

const ConditionsPage = () => {
  const modalRef = useRef(null); // Ref for the modal element
  const location = useLocation(); // Hook to get current URL location

  useEffect(() => {
    // Check if the URL contains a hash
    if (location.hash) {
      const targetId = location.hash.substring(1); // Remove the "#" character from the hash
      const targetElement = document.getElementById(targetId); // Find the corresponding element by ID

      // If the target element corresponding to the hash is found, scroll to it smoothly
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth", // Smooth scrolling behavior
          block: "center", // Center alignment
          inline: "nearest", // Nearest alignment
        });
      }
    } else {
      // If there's no hash in the URL, scroll to the top of the page
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Smooth scrolling behavior
      });
    }
  }, [location.hash]); // Run this effect whenever location.hash changes

  const scrollToSection = (sectionId) => {
    const targetSection = document.getElementById(sectionId); // Find the target section by ID

    if (targetSection && modalRef.current) {
      // If the target section exists and modalRef is defined
      targetSection.scrollIntoView({
        behavior: "smooth", // Smooth scrolling behavior
        block: "center", // Center alignment
        inline: "nearest", // Nearest alignment
        container: modalRef.current, // Scroll within the modal container
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
        className=" grid place-content-center mx-3 my-6  overflow-y-auto rounded-md z-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
      >
        <motion.div className="bg-slate-100 rounded-lg max-w-[55rem] ">
          <TermsHeader
            title="Terms Of Sale"
            lastUpdate="Last update: December 2023"
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
                      <span>{`${sectionIndex + 1}.${paragraphIndex + 1}`}</span>
                      <span>{paragraph}</span>
                    </motion.li>
                  ))}
                </ol>
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default ConditionsPage;
