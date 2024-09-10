import {
  KeyboardArrowDown,
  KeyboardArrowDownOutlined,
} from "@mui/icons-material";
import React from "react";

export const SelectInput = ({
  defaultValue,
  disabled,
  handleSelect,
  defaultOption,
  options,
  label,
  selectedValue,
  error,
  id,
}) => {

  return (
    <>
      <div className="relative cursor-pointer">
        {/* Renderizza il menu a tendina con le opzioni dei paesi */}
        <select
          className={`  h-[52px] cursor-pointer w-full appearance-none rounded-sm border-[1.5px]  bg-slate-100 py-0
        pl-3 pr-12 text-sm text-gray-600 outline-none transition-all
        peer  aria-selected:text-gray-800 aria-selected:border-gray-800 
      ${error ? "border-red-700 focus:ring focus:ring-red-200" : "focus:ring focus:ring-gray-400 focus:border-gray-500 border-gray-800 focus:ring-opacity-60"}
        `}
          defaultValue={defaultValue}
          aria-selected={selectedValue}
          onChange={handleSelect}
          id={id}
        >
          <option value="" disabled={disabled}>
            {defaultOption}
          </option>

          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <label
          className={`pointer-events-none absolute hidden bg-slate-100 p-1 text-xs text-gray-800
        
        peer-aria-selected:-top-3 peer-aria-selected:left-3 peer-aria-selected:text-xs peer-aria-selected:block peer-aria-selected:text-gray-800
        
        `}
          htmlFor={id}
        >
          {label}
        </label>
        <span
          className={`pointer-events-none ${
            selectedValue && "text-gray-800"
          } text-gray-500 absolute right-3 top-2`}
        >
          <KeyboardArrowDownOutlined fontSize="large" />
        </span>
      </div>
      {/* {error && (
        <div className="-mt-7">
          <span className="text-red-600 text-sm">{error}</span>
        </div>
      )}  */}
    </>
  );
};
