import React from "react";
import { capitalizeFirstLetter } from "../../utilities/capitalizeFirstLetter";

const filterOptions = ["all", "ingredients"];

const FilterBy = ({ value, onFilterChange }) => {
  const breakLine = `after:h-2 after:flex-1 after:flex after:flex-shrink-0 after:border-b-2 after:border-solid after:border-slate-300 after:my-2 after:content-['']`;
  return (
    <div className="grid gap-3">
      <h3 className="text-xs text-slate-600">Filter By</h3>
      <div className="flex flex-wrap overflow-hidden text-sm gap-4">
        {filterOptions.map((filter, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={value === filter}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onFilterChange(filter);
            }}
            className={`flex px-3 py-2 min-w-20 w-auto max-w-32 justify-center rounded-lg ${value === filter ? "bg-primary-btn hover:brightness-105" : "bg-slate-200 hover:bg-primary-btn"}`}
          >
            {capitalizeFirstLetter(filter)}
          </button>
        ))}
      </div>
      <div className={breakLine}></div>
    </div>
  );
};

export default FilterBy;
