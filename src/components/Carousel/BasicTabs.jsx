import React, { useState } from "react";
import { TabPanel } from "./TabPanel";
import { LatestViewer } from "./LatestViewer";
import { BestsellerView } from "./BestsellerView";

export const BasicTabs = () => {
  const [value, setValue] = useState(0);

  const handleChange = (index) => {
    setValue(index);
  };

  const tabsList = [
    {
      label: "Bestseller",
      component: <BestsellerView />,
    },
    {
      label: "Latest",
      component: <LatestViewer />,
    },
  ];

  return (
    <div className="w-full">
      <div className="my-5 flex justify-center  gap-5">
        <div
          aria-label="product-tabs"
          role="tablist"
          className={`relative mb-4 flex h-16 w-full items-center border-b border-slate-200 text-slate-100`}
        >
          {tabsList.map((tab, index) => (
            <button
              key={index}
              onClick={() => handleChange(index)}
              role="tab"
              aria-selected={value === index}
              className={`flex flex-auto justify-center  px-4 py-2 text-base text-slate-100 ease-in lg:text-xl ${
                value === index ? " opacity-100" : " hover:opacity-100  opacity-60"
              }`}
            >
              {tab.label}
            </button>
          ))}
          <div
            className="absolute left-0 -bottom-0.5 h-1 w-1/2 rounded-lg  bg-primary-btn duration-300"
            style={{ transform: `translateX(${value * 100}%)` }}
          ></div>
        </div>
      </div>
      {tabsList.map((tab, index) => (
        <TabPanel key={index} value={value} index={index}>
          {tab.component}
        </TabPanel>
      ))}
    </div>
  );
};
