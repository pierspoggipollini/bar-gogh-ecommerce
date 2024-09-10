import React from 'react'
import "./checkbox.css"

export const CheckboxInput = ({onInputChange,  name, checked, label, aria }) => {
  return (
    <>
      <label htmlFor={name} className="flex container items-center gap-3">
        <input
          id={name}
          type="checkbox"
          name={name}
          onChange={onInputChange}
          checked={checked}
          className="hidden pointer-events-none"
          aria-labelledby={name}
          aria-checked={checked ? "true" : "false"}
        />
        <svg viewBox="0 0 64 64" className="ml-0.5" height="25px" width="25px">
          <path
            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
            pathLength="575.0541381835938"
            className="path"
            role="checkbox"
            aria-checked={checked ? "true" : "false"}
          ></path>
        </svg>

        <span id="checkbox-description" className=" text-sm cursor-pointer">
          {label}
        </span>
      </label>
    </>
  );
}
