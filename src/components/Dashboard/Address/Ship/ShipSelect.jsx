import { KeyboardArrowDown, KeyboardArrowDownOutlined } from '@mui/icons-material';
import React from 'react'

export const ShipSelect = ({
  handleSelect,
  options,
  valueKey,
  nameKey,
  label,
  selectedValue,
  isStateValid,
  id
}) => {

  return (
    <>
      <div className="relative  cursor-pointer">
        <select
          className={` h-[52px] cursor-pointer w-full appearance-none rounded-sm border-[1.5px]  bg-slate-100 py-0
        pl-3 pr-12 text-sm xs:text-base text-gray-600 outline-none transition-all
        peer  aria-selected:text-gray-800 aria-selected:border-gray-800 
        ${isStateValid ? "focus:ring focus:ring-gray-400 focus:border-gray-500 border-gray-800 focus:ring-opacity-60" : "border-red-700 focus:ring focus:ring-red-200"}
        `}
          value={selectedValue}
          /* defaultValue={selectedValue} */
          aria-selected={selectedValue !== label}
          onChange={handleSelect}
          id={id}
        >
          <option value="">{label}</option>

          {options.map((option) => (
            <option key={option[valueKey]} value={option[valueKey]}>
              {option[nameKey]}
            </option>
          ))}
        </select>
        <label
         htmlFor={id}
          className={`pointer-events-none absolute hidden bg-slate-100 p-1 text-xs text-gray-800
        
        peer-aria-selected:-top-3 peer-aria-selected:left-3 peer-aria-selected:text-xs peer-aria-selected:block peer-aria-selected:text-gray-800
        
        `}
        >
          {label}
        </label>
        <span
          className={`pointer-events-none ${
            selectedValue ? "text-gray-800" : "text-gray-500"
          } text-gray-500 absolute right-3 top-2`}
        >
          <KeyboardArrowDownOutlined fontSize="large" />
        </span>
      </div>
      {!isStateValid && (
        <div className="-mt-7">
          <span className="text-red-700 text-sm">Please select a state.</span>
        </div>
      )}
    </>
  );
};

