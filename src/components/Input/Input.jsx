import { Search } from "@mui/icons-material"; // Importing the Search icon from Material UI
import React from "react"; // Importing React
import { twMerge } from "tailwind-merge"; // Importing tailwind-merge for merging Tailwind CSS classes

const Input = ({
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
}) => {
  return (
    <>
      {/* Input container with relative positioning and grid layout */}
      <div className="relative grid gap-1">
        {/* Input field */}
        <input
          type={type}
          name={name}
          className={twMerge(
            `
              ${error ? "border-red-700 focus:ring focus:ring-red-200" : "focus:ring focus:ring-gray-400 focus:border-gray-500 border-gray-800 focus:ring-opacity-60"}
              peer h-[52px] w-full ${paymentCard ? "pl-14 pr-10" : "px-4"} bg-transparent text-sm xs:text-base valid:text-gray-800 rounded-sm border-[1.5px]
              placeholder-transparent  outline-none transition duration-300 ease-in-out focus:placeholder-slate-500
            `,
            classNameInputFind, // Merging custom className for input
          )}
          placeholder={placeholder}
          value={value}
          maxLength={maxLength}
          required={required}
          onChange={onInputChange}
          onBlur={onBlur}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedby}
          id={htmlFor}
        />
        {/* Conditionally rendering the search icon */}
        {find && (
          <span className="absolute top-3 left-3">
            <Search fontSize="small" sx={{ color: "grey.800" }} />
          </span>
        )}
        {/* Label for the input field */}
        <label
          htmlFor={htmlFor}
          className={twMerge(
            `
              max-h-7 truncate pointer-events-none absolute left-3 -top-3 bg-slate-100 p-1 text-xs transition-all
              ${error ? "text-red-700" : "text-gray-800"}
              peer-placeholder-shown:text-slate-500
              peer-placeholder-shown:top-3 xs:peer-placeholder-shown:top-2.5
              peer-placeholder-shown:left-3 peer-placeholder-shown:bg-slate-100
              peer-placeholder-shown:text-sm xs:peer-placeholder-shown:text-base
              peer-focus:peer-placeholder-shown:-top-3 peer-focus:peer-placeholder-shown:left-3
              peer-focus:peer-placeholder-shown:text-xs peer-focus:peer-placeholder-shown:p-1
              peer-focus:left-3 peer-focus:-top-3 peer-focus:bg-slate-100
              peer-focus:p-1 peer-focus:text-xs peer-focus:text-gray-800
            `,
            classNameLabelFind, // Merging custom className for label
          )}
        >
          {label}
        </label>
        {/* Conditionally rendering the selected image for payment card */}
        {paymentCard && (
          <img
            src={selectedImage}
            alt={paymentCard}
            className="absolute top-2.5 left-3 w-8 h-auto"
          />
        )}
        {/* Displaying error message */}
        {error && <div className="text-red-700 mt-1 text-sm">{error}</div>}
      </div>
    </>
  );
};

export default Input;
