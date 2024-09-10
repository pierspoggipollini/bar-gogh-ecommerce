import React from "react";
import { RadioInput } from "../../../Input/RadioInput";
import { useDispatch, useSelector } from "react-redux";
import * as CartActions from "../../../../store/cart";
import * as CheckoutActions from "../../../../store/checkout";
import { InfoPickUp } from "./InfoPickUp";

export const PickUpOrder = () => {
  const dispatch = useDispatch();
  const pickupInStore = useSelector((state) => state.cart.pickupInStore);

  const handlePickupInStore = (e) => {
    const value = e.target.value === "true"; // Converte la stringa in booleano
    dispatch(CartActions.setPickupInStore(value));
    /*  dispatch(CartActions.updateShip(0)); */
    dispatch(
      CheckoutActions.updateShippingOptions({
        name: "pickupInStore",
        type: "Pick up in store",
        expectedShipDate: null,
      }),
    );
  };


  return (
    <div className="grid gap-3">
      <RadioInput
        name="pickup"
        title="In-store pickup - FREE"
        onChange={handlePickupInStore}
        valueRadio={true}
        selectedValue={pickupInStore}
        description="Bargogh Store"
      />
      <InfoPickUp />
    </div>
  );
};
