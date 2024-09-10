import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "swiper/css/pagination";
import "./swiperStyle.css";
import "swiper/swiper.min.css";
import "swiper/css/pagination";
import * as cartAction from "../../store/cart";
import OrderSummarySidebar from "./OrdersConfirmation/OrderSummarySidebar";
import useCurrencyFormatter from "../utilities/currency/useCurrencyFormatter";

// Definition of the SideCheckout component
export const SideCheckout = () => {
  // Redux selectors to get cart items and total order details
  const cart = useSelector((state) => state.cart.items);
  const totalOrder = useSelector((state) => state.cart.totalOrder);
  
  const formatAmount = useCurrencyFormatter();
  // Calculate the total quantity of items in the cart
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Get subtotal, dispatch function, and discount amount from the Redux store
  const subtotal = useSelector((state) => parseFloat(state.cart.subtotal));
  const dispatch = useDispatch();
  const discountAmount = useSelector((state) => state.cart.discountAmount);

  // Get shipping, pickupInStore, and calculate the updated total value using useMemo
  const ship = useSelector((state) => state.cart.ship);
  const pickupInStore = useSelector((state) => state.cart.pickupInStore);
  const updatedTotalValue = useMemo(() => {
    // Logic to calculate the updated total based on different conditions
    let calculatedTotal = 0;
    switch (true) {
      case discountAmount && subtotal < 50 && !pickupInStore:
        calculatedTotal = subtotal - discountAmount + ship;
        break;

      case discountAmount && subtotal >= 50 && !pickupInStore:
        calculatedTotal = subtotal - discountAmount + ship;
        break;

      case discountAmount && pickupInStore:
        calculatedTotal = subtotal - discountAmount;
        break;

      case !discountAmount && subtotal < 50 && !pickupInStore:
        calculatedTotal = subtotal + ship;
        break;

      case !discountAmount && subtotal >= 50 && !pickupInStore:
        calculatedTotal = subtotal + ship;
        break;

      case !discountAmount && pickupInStore:
        calculatedTotal = subtotal;
        break;

      default:
        calculatedTotal = subtotal;
        break;
    }

    return parseFloat(calculatedTotal);
  }, [subtotal, discountAmount, ship, pickupInStore]);

  // Dispatch function to update the total order with the calculated value
  const updateTotal = (newTotal) => {
    dispatch(cartAction.updateTotalOrder(newTotal));
  };

  // Apply the updated total value using useCallback
  const applyUpdatedTotal = useCallback(() => {
    updateTotal(updatedTotalValue);
  }, [updateTotal, updatedTotalValue]);

  // useEffect to apply the updated total when the component mounts
  useEffect(() => {
    applyUpdatedTotal();
  }, [applyUpdatedTotal]);

  return (
    <>
      <OrderSummarySidebar
        pickupInStore={pickupInStore}
        totalOrder={formatAmount(totalOrder)}
        discountAmount={discountAmount}
        ship={ship}
        orderData={cart}
        count={count}
        subtotal={formatAmount(subtotal)}
        paymentMethod={false}
        title="Your Cart"
      />
    </>
  );
};
