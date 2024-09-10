import React, { useEffect } from "react";

export const RadioInput = ({
  title,
  description,
  selectedValue,
  valueRadio,
  onChange,
  name,
}) => {
  
  return (
    <>
      <div className="flex items-center gap-6">
        <div className=" inline-block relative cursor-pointer">
          <label
            htmlFor={name}
            className={`grid gap-1 pl-9 mb-2 relative text-base cursor-pointer transition-all duration-300`}
          >
            <input
              type="radio"
              value={valueRadio}
              id={name}
              name={name}
              onChange={onChange}
              checked={selectedValue === valueRadio}
              className={` absolute peer cursor-pointer opacity-0 w-0 h-0 `}
            />
            <span className="text-sm font-semibold">{title}</span>
            <span className="text-sm text-ellipsis">{description}</span>
            <span
              className={`peer-checked:peer-hover:scale-90 peer-checked:transform peer-checked:-translate-y-1/2 peer-checked:border-4 peer-checked:border-primary-btn peer-checked:scale-90
                          peer-hover:transform peer-hover:-translate-y-1/2 peer-hover:scale-125  peer-hover:border-primary-btn peer-hover:shadow-custom              
                          absolute top-1/2 left-0 transform -translate-y-1/2 w-5 h-5 rounded-[50%]  border-2 border-slate-600 transition-all`}
              aria-checked={selectedValue === valueRadio ? "true" : "false"}
              aria-label={title}
            ></span>
          </label>
        </div>
      </div>
    </>
  );
};
