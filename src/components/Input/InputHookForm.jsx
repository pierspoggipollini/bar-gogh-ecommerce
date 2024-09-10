import React from "react";
import { twMerge } from "tailwind-merge";

const InputHookForm = ({
  name,
  placeholder,
  value,
  maxLength,
  onInputChange,
  onBlur,
  htmlFor,
  label,
  type,
  required,
  find,
  error,
  classNameInputFind,
  classNameLabelFind,
  paymentCard,
  selectedImage,
  register,
  validation,
  ariaInvalid,
  ariaDescribedby,
  touched,
}) => {
  return (
    <>
      <div className="relative grid  gap-1">
        <input
          type={type}
          name={name}
          className={twMerge(
            ` 
            ${error ? " border-red-700 focus:ring focus:ring-red-200" : "focus:ring focus:ring-gray-400 focus:border-gray-500  border-gray-800 focus:ring-opacity-60"}
           
        peer  h-[52px] w-full bg-transparent rounded-sm border-[1.5px]  px-4   
        text-sm xs:text-base valid:text-gray-800
        placeholder-transparent outline-none shadow-sm  transition duration-300 ease-in-out  focus:placeholder-slate-500 `,
            classNameInputFind, //twmerge per overrade css
          )}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          onBlur={onBlur}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedby}
          {...register(name, validation)}
        />

        <label
          htmlFor={htmlFor}
          className={twMerge(
            ` 
     max-h-7
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
      peer-placeholder-shown:text-slate-500
      peer-placeholder-shown:top-3
      xs:peer-placeholder-shown:top-2.5
      peer-placeholder-shown:left-3
      peer-placeholder-shown:bg-inherit
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

export default InputHookForm;
