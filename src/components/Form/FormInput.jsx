import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// FormInput component accepting props for various configurations and states
export const FormInput = ({
  type, // input type (e.g., text, email, password)
  name, // input name
  placeholder, // input placeholder
  label, // label text
  htmlFor, // label 'for' attribute
  register, // react-hook-form register function
  error, // error message
  onBlur, // onBlur event handler
  ariaInvalid, // aria-invalid attribute for accessibility
  ariaDescribedby, // aria-describedby attribute for accessibility
}) => {
  const eye = <FontAwesomeIcon icon={faEye} size="sm" />;
  const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} size="sm" />;

  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

  // Function to determine the input type based on the 'type' prop and 'showPassword' state
  const getType = (type, showPassword) => {
    if (showPassword) {
      return "text";
    } else {
      switch (type) {
        case "email":
          return "email";
        case "password":
          return "password";
        default:
          return "text";
      }
    }
  };

  const inputType = getType(type, showPassword);

  return (
    <div className="relative grid gap-1">
      <input
        type={inputType}
        name={name}
        className={`
          ${error ? "border-red-700 focus:ring focus:ring-red-200" : "focus:ring focus:ring-gray-400 focus:border-gray-500 border-gray-600 focus:ring-opacity-60"}
          peer h-12 shadow-sm transition duration-300 ease-in-out w-full border-[1.5px] valid:text-neutral-900 
          rounded-xl bg-transparent p-2 py-0 px-4 text-sm placeholder-transparent outline-none focus:placeholder-slate-500
        `}
        placeholder={placeholder}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedby}
        autoComplete="current-password"
        onBlur={onBlur}
        id={htmlFor}
        {...register(name)}
      />
      <label
        htmlFor={htmlFor}
        className={`
          pointer-events-none 
          absolute
          left-3
          -top-3
          bg-primary
          p-1
          text-neutral-900
          text-xs
          transition-all
          ${error ? "text-red-700" : "text-neutral-900"}
          md:peer-placeholder-shown:top-2
          peer-placeholder-shown:top-2.5
          peer-placeholder-shown:bg-primary
          peer-placeholder-shown:text-sm
          peer-placeholder-shown:text-neutral-600
          peer-focus:-top-3
          peer-focus:left-3              
          peer-focus:bg-primary
          peer-focus:p-1
          peer-focus:text-xs
          peer-focus:text-neutral-800
          md:peer-placeholder-shown:text-base
          md:peer-focus:-top-3
          md:peer-focus:left-3
          md:peer-focus:p-1
          md:peer-focus:text-xs
          md:peer-focus:text-neutral-800
        `}
      >
        {label}
      </label>
      {type === "password" && (
        <i
          className="absolute right-6 translate-y-3 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? eye : eyeSlash}
        </i>
      )}
      {error && <div className="text-red-700 mt-1 text-xs">{error}</div>}
    </div>
  );
};
