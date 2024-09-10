import { KeyboardArrowDownOutlined } from '@mui/icons-material';
import React from 'react'

export const CountrySelect = ({
  disabled,
  defaultOption,
  defaultStateValue,
  options,
  valueKey,
  country,
  selectedValue,
  nameKey,
  handleSelect,
  defaultValue,
}) => {
  return (
    <div className="flex gap-2 relative justify-center max-w-xs items-center ">
      <div className="p-1">
        <img
          alt={country}
          src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${country}.svg`}
          className=" h-9 xs:h-7 md:h-6 overflow-hidden rounded"
        />
      </div>
      <select
        defaultValue={defaultValue}
        aria-selected={selectedValue}
        onChange={handleSelect}
        className=" bg-transparent outline-none cursor-pointer max-w-[8rem] w-4 overflow-hidden flex  appearance-none  h-full "
      >
        {options.map((option) => (
          <option
            className=""
            key={option[valueKey]}
            value={option[valueKey]}
          >
            {option[nameKey]}
          </option>
        ))}
      </select>

      <span className={`pointer-events-none bg-slate-100   absolute right-0 text-slate-800 `}>
        <KeyboardArrowDownOutlined fontSize="medium" />
      </span>
    </div>
  );
};
