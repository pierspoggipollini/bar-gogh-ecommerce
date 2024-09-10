import React, { useState } from "react";
import { PromoInput } from "./PromoInput";
import axios from "axios";
import * as CartActions from "../../store/cart";
import { useDispatch, useSelector } from "react-redux";
import icon from "../../assets/loading.svg";
import { motion } from "framer-motion";
import apiBaseUrl from "../../config/apiConfig";

export const PromoValidity = () => {
  const dispatch = useDispatch();

  const subtotal = useSelector((state) => parseFloat(state.cart.subtotal));
  const discountApplied = useSelector((state) => state.cart.discountApplied);

  const [inputCode, setInputCode] = useState("");

  const [validity, setValidity] = useState({
    initial: true,
    error: false,
    /*  submitted: false, */
  });

  const [fetchError, setFetchError] = useState("");

  const [buttonState, setButtonState] = useState({
    isLoading: false,
    isApplied: false,
  }); 

  const applyPromotionalCode = async (code) => {
    try {
      setValidity({ ...validity, initial: false });
      setButtonState({ ...buttonState, isLoading: true });

      /*  const response = await axios.post(
        "https://test-api-rwgb.onrender.com/promotional-code",
        { code },
      ); */

      const response = await axios.post(`${apiBaseUrl}checkout/promotional-code`,
        {
          code,
        },
      );

      if (response.status === 200) {
        const promotionalCode = response.data;
        // Check if the promotional code is valid and the cart total is greater than 30 euros
        if (!discountApplied && promotionalCode && subtotal >= 30) {
          // Dispatch the action to apply the discount in Redux store
          dispatch(
            CartActions.applyDiscount({
              discount: { valid: true, value: promotionalCode.discount },
            }),
          );
          setValidity({ ...validity, error: false });

          setButtonState({
            ...buttonState,
            isLoading: false,
            isApplied: true,
          });

          setTimeout(() => {
            setButtonState({ ...buttonState, isApplied: false });
          }, 2000);
        } else {
          // Handle invalid promotional code or cart total less than 30 euros
          setFetchError("Cart total is less than 30 euros");
          setValidity({ ...validity, error: true });
          setButtonState({
            ...buttonState,
            isLoading: false,
            isApplied: false,
          });
        }
      }
    } catch (error) {
      // Check if error.response is defined to handle API errors
      if (error.response) {
        setFetchError(error.response.data.error);
        setValidity({ ...validity, error: true });
      } else {
        // Handle other errors (e.g., network errors)
        setFetchError("Error while processing the request.");
        setValidity({ ...validity, error: true, initial: true });
      }
      setButtonState({
        ...buttonState,
        isLoading: false,
        isApplied: false,
      });
    }
  };

  return (
    <>
      <form
        id="coupon"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          applyPromotionalCode(inputCode);
        }}
        className=" flex flex-col gap-5 text-primary-black"
      >
        <div className="flex flex-col md:flex-row gap-5 md:items-center">
          <PromoInput
            type="text"
            name="text"
            placeholder="insert here"
            label="Promotional code"
            maxLength={8}
            onInputChange={(e) => setInputCode(e.target.value)}
            initialValidity={validity.initial}
            valid={discountApplied}
            value={inputCode}
          />

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            title="Apply"
            aria-label="Apply"
            className=" flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg outline-none  border-none 
                    bg-primary-btn font-bold py-2.5 px-12 uppercase
                   disabled:opacity-70 disabled:cursor-not-allowed
                text-primary-black md:max-w-[10rem] lg:hover:bg-primary-hover"
            disabled={
              buttonState.isLoading || buttonState.isApplied || discountApplied
            }
          >
            {buttonState.isLoading && <img src={icon} />}
            <span className="text-sm">
              {buttonState.isLoading
                ? "Processing..."
                : buttonState.isApplied
                  ? "Applied"
                  : "Apply"}
            </span>
          </motion.button>
        </div>

        {discountApplied && validity.error === false && subtotal >= 30 && (
          <div className="flex w-full justify-center rounded border border-green-500 bg-slate-100 p-2 text-center">
            <span className="text-sm uppercase">Discount applied</span>
          </div>
        )}

        {validity.error && (
          <div className="w-full flex justify-center rounded border border-red-500 bg-slate-100 p-2 text-center">
            <span className="text-sm uppercase  text-red-700">
              {fetchError}
            </span>
          </div>
        )}
      </form>
    </>
  );
};
