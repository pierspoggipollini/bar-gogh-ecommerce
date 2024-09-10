import React from "react";

export const PromoInput = ({
  type,
  name,
  placeholder,
  value,
  onInputChange,
  label,
  htmlFor,
  maxLength,
  initialValidity,
  valid,
  onBlur,
  Promo,
}) => {
  return (
    <>
      <div className="relative">
        <input
          className={` ${
            initialValidity
              ? "border-b-slate-400"
              : valid
              ? "border-b-green-600"
              : "border-b-red-600"
          } relative w-full bg-transparent ${
            Promo
              ? "border-b-slate-400  text-xs text-slate-700 "
              : "border-b-slate-400  text-base text-slate-700"
          }  peer border-b-2
                  pt-5  pb-1  placeholder-transparent outline-none transition-all duration-300 focus:placeholder-transparent  `}
          placeholder={placeholder}
          type={type}
          name={name}
          value={value}
          maxLength={maxLength}
          required
          onChange={onInputChange}
          onBlur={onBlur}
        />
        <label
          htmlFor={htmlFor}
          className={`
            absolute left-0  
            ${
              Promo
                ? ` -top-1 text-xs text-slate-700 peer-placeholder-shown:top-4
                 peer-placeholder-shown:text-sm 
                peer-placeholder-shown:text-slate-700 peer-focus:left-0 peer-focus:-top-1
                 peer-focus:text-xs peer-focus:text-slate-700 `
                : ` -top-2 text-base text-black peer-placeholder-shown:top-5
                 peer-placeholder-shown:text-base
                peer-placeholder-shown:text-black peer-focus:left-0 peer-focus:top-0
                 peer-focus:text-sm peer-focus:text-slate-800 `
            }
             pointer-events-none transition-all duration-300 `}
        >
          {label}
        </label>
        <div className="absolute bottom-0 left-0 h-1 w-full scale-x-0 bg-slate-600 transition-all duration-300"></div>
      </div>
    </>
  );
};
