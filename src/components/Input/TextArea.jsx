import React from "react";
import { twMerge } from "tailwind-merge";

const TextArea = ({
  name,
  placeholder,
  value,
  onInputChange,
  onBlur,
  htmlFor,
  label,
  required,
  error,
  classNameInputFind,
  classNameLabelFind,
  register,
  validation,
  ariaDescribedby,
  ariaInvalid,
}) => {
  return (
    <>
      <div className="relative grid  gap-1">
        <textarea
          className={twMerge(
            ` 
         ${error ? " border-red-600 focus:ring focus:ring-red-200" : "focus:ring focus:ring-gray-400 focus:border-gray-500  border-gray-800 focus:ring-opacity-60"}
        peer  h-[150px] w-full px-4 resize-none  bg-transparent rounded-sm border-[1.5px] py-4
        text-sm xs:text-base valid:text-gray-800
        placeholder-transparent outline-none transition duration-300 ease-in-out focus:placeholder-slate-500 `,
            classNameInputFind, //twmerge per overrade css
          )}
          placeholder={placeholder}
          value={value}
          maxLength={1000}
          required={required}
          onChange={onInputChange}
          onBlur={onBlur}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedby}
          {...register(name, { required, ...validation })}
        />

        <label
          htmlFor={htmlFor}
          className={twMerge(
            `   max-h-7
      truncate 
      pointer-events-none 
      absolute
      left-3
      -top-3
      bg-slate-100
      p-1
      text-xs
      transition-all
      ${error ? "text-red-700" : "text-gray-800"}
      peer-placeholder-shown:text-gray-500
      peer-placeholder-shown:top-3
      xs:peer-placeholder-shown:top-2.5
      peer-placeholder-shown:left-3
      peer-placeholder-shown:bg-slate-100
      peer-placeholder-shown:text-sm
      xs:peer-placeholder-shown:text-base

      peer-focus:peer-placeholder-shown:-top-3
      peer-focus:peer-placeholder-shown:left-3
      peer-focus:peer-placeholder-shown:text-xs
      peer-focus:peer-placeholder-shown:p-1

      peer-focus:left-3
      peer-focus:-top-3
      peer-focus:bg-slate-100
      peer-focus:p-1
      peer-focus:text-xs
      peer-focus:text-gray-800
          `,
            classNameLabelFind,
          )}
        >
          {label}
        </label>
        {error && <div className="text-red-700 mt-1 text-sm">{error}</div>}
      </div>
    </>
  );
};

export default TextArea;
