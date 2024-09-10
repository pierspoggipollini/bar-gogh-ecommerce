import React from "react";
import ShoppingCartProgress from "../DetailsProducts/ShoppingCartProgress";
import { useNavigate } from "react-router";
import { cardImages } from "../Dashboard/Payment/CardImages";
import { motion } from "framer-motion";

export const SideCart = ({ subtotal, shipCost }) => {
  const navigate = useNavigate();

  return (
    <aside className=" border-y-4 px-10 mb-3 w-full min-h-[22rem] h-auto py-5 md:max-w-[31.125rem] lg:min-w-full rounded-lg flex flex-col bg-slate-200 overflow-scroll lg:border-none">
      <div>
        <ShoppingCartProgress />
      </div>
      <div className="flex flex-col lg:max-w-[16rem] h-full gap-3">
        <div className=" flex gap-2 max-w-full flex-col ">
          <div className="mt-7 min-h-[10px] flex justify-between text-base">
            <b className="">Subtotal</b>
            <span className="tabular-nums font-semibold">{subtotal}</span>
          </div>
          <div className="min-h-[10px] flex justify-between text-base">
            <b>Ship</b>
            <span className="tabular-nums font-semibold">{shipCost}</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            role="button"
            title="Checkout"
            aria-label="Checkout"
            onClick={() => navigate("/checkout")}
            className=" w-full md:w-64 lg:w-full h-full max-h-12 rounded-[2.5rem] bg-primary-btn py-3 px-5 text-base font-bold uppercase outline-none hover:bg-primary-hover"
          >
            Checkout
          </motion.button>
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-sm">We Accept:</h3>
            <div className="flex flex-wrap gap-1">
              {Object.entries(cardImages).map(([cardName, cardImage]) => (
                <img
                  key={cardName}
                  src={cardImage}
                  alt={cardName}
                  className="w-8 h-8"
                />
              ))}
            </div>
          </div>
        </div>

        {/*     <div
          className="  flex  w-full  border-none py-6  text-xs 
        before:m-0 before:h-2 before:flex-1 before:flex-shrink-0 before:border-b before:border-solid before:border-slate-600 before:content-[''] 
         after:m-0 after:h-2 after:flex-1 after:flex-shrink-0 after:border-b after:border-solid after:border-slate-600 after:content-[''] "
        >
          <span className="m-0 flex-[0.5] flex-shrink-0 text-center uppercase">
            or
          </span>
        </div>
        <div className="flex justify-center">
          <button className="w-64 rounded-full border border-slate-400 bg-slate-200 py-3 px-5 text-base font-semibold uppercase hover:bg-blue-200">
            Paypal
          </button>
        </div> */}
        <div className="text-sm leading-relaxed">
          Do you have a discount code? You can add it in the next step.
        </div>
      </div>
    </aside>
  );
};
