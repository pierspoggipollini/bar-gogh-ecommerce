import React, { useState } from "react";
import { TabPanel } from "../../Carousel/TabPanel";
import { HomeDelivery } from "./HomeDelivery/HomeDelivery";
import { PickUpOrder } from "./PickUpInStore/PickUpOrder";
import { useSelector } from "react-redux";

// Definition of the TabsCheckout component
export const TabsCheckout = () => {
  const shippingOption = useSelector((state) => state.checkout.shippingOption);

  // Determine if the shipping option name is "standard"
  const isStandard =
    shippingOption && shippingOption.hasOwnProperty("standard");
  // Determine if the shipping option name is "express"
  const isExpress =
    shippingOption && shippingOption.hasOwnProperty("express");

  // State to manage the selected tab index
  const [value, setValue] = useState(isStandard || isExpress ? 0 : 1); // Show 0 if it's "standard", otherwise show 1

  // Function to handle tab changes
  const handleChange = (index) => {
    setValue(index);
  };

  // List of tabs with their labels and corresponding components
  const tabsList = [
    {
      label: "Home Delivery",
      component: <HomeDelivery />,
    },
    {
      label: "Pick Up My Order",
      component: <PickUpOrder />,
    },
    // Add more tabs here if necessary
  ];

  return (
    <div className="w-full">
      {/* Tab navigation buttons */}
      <div className="flex justify-center gap-5">
        <div
          aria-label="product-tabs"
          role="tablist"
          className={`relative p-1 mb-5 flex h-16 w-full items-center`}
        >
          {/* Map through tabsList and create buttons for each tab */}
          {tabsList.map((tab, index) => (
            <button
              key={index}
              onClick={() => handleChange(index)}
              role="tab"
              aria-selected={value === index}
              className={`flex flex-auto border-solid justify-center border-slate-600 px-4 py-2 text-base transition ease-in lg:text-lg ${
                value === index
                  ? " border-1-1-0-1 opacity-100"
                  : "border-0-0-1-0 opacity-60"
              }`}
              aria-controls={`tabpanel-${index}`}
            >
              {tab.label}
            </button>
          ))}
          {/* Indicator line to highlight the selected tab */}
          {/* Uncomment the following code if you want to include the indicator line */}
          {/* <div
            className="absolute left-0 -bottom-0.5 h-1 w-1/2 rounded-lg  bg-primary-btn duration-300"
            style={{ transform: `translateX(${value * 100}%)` }}
          ></div> */}
        </div>
      </div>

      {/* Render the selected tab's content */}
      {tabsList.map((tab, index) => (
        <TabPanel key={index} value={value} index={index}>
          {tab.component}
        </TabPanel>
      ))}
    </div>
  );
};
