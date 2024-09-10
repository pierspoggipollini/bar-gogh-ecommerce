import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import images from "../../../../images";
import { useNavigate } from "react-router";
import useCurrencyFormatter from "../../utilities/currency/useCurrencyFormatter";


export const ConfirmationItem = ({
  image,
  category,
  title,
  grams,
  price,
  quantity,
  link,

}) => {
  const navigate = useNavigate();
  const formatAmount = useCurrencyFormatter();
  return (
    <>
      <AnimatePresence>
        <motion.div className=" max-w-[32rem] -z-0 h-[200px]  md:h-[12rem] flex cursor-default border-b-slate-200 bg-slate-200  transition-shadow  rounded-sm">
          <div className=" rounded-l-sm h-full w-[7rem] xs:w-52 md:w-[16rem] flex justify-center items-center bg-slate-300  overflow-hidden">
            <img
              src={images[image]}
              alt="product"
              className="cursor-pointer max-w-full scale-95 max-h-full "
              onClick={() => navigate(link)}
            />
          </div>

          <div className=" flex p-4 min-h-[105px] md:p-4 w-full lg:w-[30rem] relative flex-col justify-center gap-2 text-primary-black">
            <span aria-label="categories" className="text-xs text-slate-600">
              {category}
            </span>
            <h1
              aria-label="product title"
              className="text-base text-slate-900 font-bold"
            >
              {title}
            </h1>
            <span aria-label="grams" className="text-xs text-slate-600">
              Grams: {grams} gr
            </span>
            <span
              aria-label="quantity"
              className="text-sm font-bold text-slate-900"
            >
              Quantity: {quantity}
            </span>
            <div className="my-2 flex items-center justify-between md:gap-0">
              <span
                aria-label="price"
                className="tabular-nums hidden text-lg text-slate-900 font-semibold md:block"
              >
                {formatAmount(price)}
              </span>
              <span
                aria-label="price"
                className="font-semibold text-lg tabular-nums text-slate-900 md:hidden"
              >
                {formatAmount(price)}
              </span>
            </div>

            {/*  <div
              onClick={(e) => handleRemove(e)}
              className="absolute md:hidden hover:bg-slate-300 rounded-full cursor-pointer right-2 p-1 top-2"
            >
              <Close />
            </div> */}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};
