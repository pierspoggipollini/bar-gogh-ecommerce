import {
  Done,
  KeyboardArrowDownOutlined,
  LocalShippingOutlined,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { PromoInput } from "./PromoInput";
import { PromoValidity } from "./PromoValidity";
import * as CartActions from "../../store/cart";

export const Promotions = () => {
  /*   const subtotal = useSelector((state) =>
    state.cart.reduce((total, item) => {
      return total + parseFloat(item.product.price) * item.quantity;
    }, 0)
  ).toFixed(2);
 */
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  // Call the updateTotalCost action

  const [openPromo, setOpenPromo] = useState(false);
  const [hasFreeShippingPromo, setHasFreeShippingPromo] = useState(false);

  const [promotions, setPromotions] = useState([]);

  /*   useEffect(() => {
    if (subtotal >= 49.99) {
      setHasFreeShippingPromo(true);
      setPromotions([{ id: "free-shipping", name: "Free Shipping" }]);
    } else {
      setHasFreeShippingPromo(false);
      setPromotions([]);
    }
  }, [subtotal]);
 */
  return (
    <div>
      <motion.div
        className="mt-12 grid w-full border-y border-y-slate-500 py-5"
        animate={openPromo ? "open" : "closed"}
      >
        <motion.button
          whileTap={{ scale: 0.95 }}
          role="button"
          aria-label="Open Promotions"
          onClick={() => setOpenPromo(!openPromo)}
          className="flex cursor-pointer items-center justify-between text-left text-sm font-semibold"
        >
          {promotions.length >= 1
            ? `Promotions (${promotions.length})`
            : `Promotions`}
          <motion.div
            variants={{
              open: { rotate: 180 },
              closed: { rotate: 0 },
            }}
            transition={{ duration: 0.2 }}
            style={{ originY: 0.55 }}
            className=""
          >
            <KeyboardArrowDownOutlined fontSize="medium" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {openPromo && (
            <>
              <PromoValidity />
            </>
          )}

          {hasFreeShippingPromo && openPromo && (
            <div className="my-5 flex w-full items-center justify-between rounded-md bg-slate-100 py-3  px-2">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <LocalShippingOutlined fontSize="small" />
                Free Shipping
              </span>
              <span className="flex items-center gap-1 text-xs text-green-600">
                <Done fontSize="small" />
                Applicated
              </span>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
