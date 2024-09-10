import React from "react";

// FormCheckbox component accepting props `register`, `action`, `name`, and `checked`
const FormCheckbox = ({ register, action, name }) => {
  return (
    <label htmlFor={name} className="flex items-center group text-sm cursor-pointer">
      {/* Hidden checkbox input */}
      <input
        type="checkbox"
        name={name}
        id={name}
        {...register(name)} // Register the input with react-hook-form
        className="absolute opacity-0 w-0 h-0 peer" // Hide the actual input
      />
      {/* Span acting as the visible and customized checkbox */}
      <span
        className="
          relative inline-block w-12 h-6 mr-3 border-[1.5px] border-gray-600 rounded-sm transition duration-300 ease-in-out
          peer-checked:bg-primary peer-checked:border-gray-700
          shadow-sm group-hover:ring group-hover:ring-orange-300
          peer-disabled:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:hover:border-gray-700
          peer-checked:after:content-['']
          peer-checked:after:w-[8px] peer-checked:after:h-[13px]
          peer-checked:after:absolute peer-checked:after:top-[2px] peer-checked:after:left-[6px]
          peer-checked:after:border-solid  peer-checked:after:border-0-2-2-0
        peer-checked:after:border-gray-700
          peer-checked:after:rotate-45
        "
      ></span>
      {/* Text or action associated with the checkbox */}
      {action}
    </label>
  );
};

export default FormCheckbox;


