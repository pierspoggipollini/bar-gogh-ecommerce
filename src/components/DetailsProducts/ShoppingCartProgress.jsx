import React from "react";
import { useSelector } from "react-redux";
import useCurrencyFormatter from "../utilities/currency/useCurrencyFormatter";

const ShoppingCartProgress = () => {
  // Fetches subtotal from Redux state
  const subtotal = useSelector((state) => parseFloat(state.cart.subtotal));

  // Constants for progress bar width calculation
  const maxProgressWidth = '100%'; // Maximum width of the progress bar
  const progressPercentage = (subtotal / 50) * 100; // Calculates percentage progress
  const progressWidth = progressPercentage >= 100 ? maxProgressWidth : `${progressPercentage}%`; // Width of the progress bar

  // Custom hook for currency formatting
  const formatAmount = useCurrencyFormatter();

  return (
    <>
      {/* Container for displaying progress information */}
      <div className="grid gap-2">
        {/* Message indicating free shipping eligibility */}
        <span className="text-center text-xs">
          {subtotal >= 50 ? (
            // Displayed when subtotal qualifies for free shipping
            <>
              You have qualified for{' '}
              <b className="font-semibold">free shipping!</b>
            </>
          ) : (
            // Displayed when subtotal does not qualify for free shipping
            <>
              You need{' '}
              <b className="font-semibold tabular-nums">
                {formatAmount(parseFloat(50 - subtotal))}
              </b>{' '}
              more for <b className="font-semibold">free shipping.</b>
            </>
          )}
        </span>

        {/* Progress bar */}
        <div className="relative flex h-1 items-center rounded-full bg-slate-400">
          {/* Actual progress indicator */}
          <div
            className="absolute left-0 top-0 h-1 bg-primary-btn"
            style={{ width: progressWidth }} // Dynamic width based on progress
          />

          {/* Labels for start and end of progress bar */}
          <label className="-m-4 -translate-x-1/2 text-[10px]">
            {formatAmount(0)} {/* Label for 0 */}
          </label>
          <label className="-m-4 ml-auto translate-x-1/2 text-[10px]">
            {formatAmount(50)} {/* Label for 50 (qualifying amount for free shipping) */}
          </label>
        </div>
      </div>
    </>
  );
};

export default ShoppingCartProgress;
