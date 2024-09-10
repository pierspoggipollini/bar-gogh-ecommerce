import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RadioInput } from "../../../Input/RadioInput";
import * as CartActions from "../../../../store/cart";
import * as CheckoutActions from "../../../../store/checkout";
import { ShipAddress } from "./ShipAddress";
import MessageProvider from "../../../Dashboard/Message/MessageProvider";
import { capitalizeFirstLetter } from "../../../utilities/capitalizeFirstLetter";

export const HomeDelivery = () => {
  const country = useSelector((state) => state.shippingData.country);

  /**
   * Adds business days to a given start date.
   *
   * @param {Date} startDate - The starting date.
   * @param {number} daysToAdd - The number of business days to add.
   * @returns {Date} - The resulting date after adding the specified business days.
   */

  function addBusinessDays(startDate, daysToAdd) {
    // Create a copy of the start date to avoid modifying the original date object
    const targetDate = new Date(startDate);

    // Loop through the days to add
    for (let i = 0; i < daysToAdd; ) {
      // Increment the date by one day
      targetDate.setDate(targetDate.getDate() + 1);

      // Skip Saturdays (6) and Sundays (0)
      if (targetDate.getDay() !== 0 && targetDate.getDay() !== 6) {
        // Increment the counter only if it's not a weekend day
        i++;
      }
    }

    // Return the resulting date after adding the specified business days
    return targetDate;
  }

  // Get the current date
  const today = new Date();

  // Calculate the date in 4 business days for standard delivery
  const standardDeliveryDate = addBusinessDays(today, 4);

  // Format the date in the desired format for standard delivery
  /*  const standardFormattedDeliveryDate = standardDeliveryDate.toLocaleDateString(
    `${country.toLowerCase()}-${country}`,
    {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  ); */

  // Format the date in the desired format for standard delivery in English
  const standardFormattedDeliveryDate = standardDeliveryDate.toLocaleDateString(
    "en-US", // Change 'en-US' to 'en-GB' if you want British English format
    {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );

  // Calculate the date in 1 business day for express delivery
  const expressDeliveryDate = addBusinessDays(today, 1);

  // Format the date in the desired format for express delivery
  const expressFormattedDeliveryDate = expressDeliveryDate.toLocaleDateString(
    "en-US", // Change 'en-US' to 'en-GB' if you want British English format
    {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );


  // Retrieves the subtotal from the Redux store using the useSelector hook
  const subtotal = useSelector((state) => parseFloat(state.cart.subtotal));

  // List of shipping options with their details
  const list = [
    {
      name: "standard",
      title: `Standard - ${subtotal <= 30 ? "€ 5,00" : "Gratis"}`,
      price: subtotal <= 30 ? 5 : 0,
      expectedDeliveryDate: `Expected delivery: ${capitalizeFirstLetter(
        standardFormattedDeliveryDate,
      )} for in-stock items only `,
    },
    {
      name: "express",
      title: "Express - € 10,00",
      price: 10,
      expectedDeliveryDate: `Expected delivery: ${capitalizeFirstLetter(
        expressFormattedDeliveryDate,
      )} for in-stock items only `,
    },
  ];

  // Explanation of the code below:

  // The 'list' array contains shipping options, each represented by an object.
  // Each object has properties like 'name', 'title', 'price', and 'expectedDeliveryDate'.
  // The 'title' property is dynamically generated based on the 'subtotal' value.

  // 'capitalizeFirstLetter' function is used to capitalize the first letter of a string.

  // The 'subtotal' value is retrieved from the Redux store using the 'useSelector' hook.

  // The 'list' array is then used to render shipping options in the UI.
  // The rendered options include information like the shipping method, price, and expected delivery date.

  // Initializes state to keep track of the selected value
/*   const [selectedValue, setSelectedValue] = useState(subtotal <= 30 ? 5 : 0); */

  // Gets the dispatch function from the Redux store
  const dispatch = useDispatch();

  // Handles the radio input change event
  const handleRadioChange = (event) => {
    const { name, value } = event.target;

    let dateToUpdate = "";
    if (name === "standard") {
      dateToUpdate = standardFormattedDeliveryDate;
    } else {
      dateToUpdate = expressFormattedDeliveryDate;
    }

/*     setSelectedValue(parseFloat(value)); */

    dispatch(
      CheckoutActions.updateShippingOptions({
        name: name,
        type: name === "standard" ? "Standard Shipping" : "Express Shipping", // Aggiorna il nome se necessario
        expectedShipDate:
          name === "standard"
            ? capitalizeFirstLetter(standardFormattedDeliveryDate)
            : capitalizeFirstLetter(expressFormattedDeliveryDate),
      }),
    );

    // Dispatches an action to update the shipping cost in the Redux store
    dispatch(CartActions.updateShip(parseFloat(value)));
  };
  // Retrieves the shipping cost from the Redux store
  const ship = useSelector((state) => state.cart.ship);

  return (
    <div className="grid pt-2 gap-3">
      {/* Maps through a list of data and renders RadioInput components for each item */}
      {list.map((data, index) => {
        return (
          <React.Fragment key={index}>
            <RadioInput
              name={data.name}
              title={data.title}
              onChange={handleRadioChange}
              valueRadio={data.price}
              selectedValue={ship}
              description={data.expectedDeliveryDate}
            />
          </React.Fragment>
        );
      })}

      {/* Renders the ShipAddress component */}
      <MessageProvider>
        <ShipAddress />
      </MessageProvider>
    </div>
  );
}