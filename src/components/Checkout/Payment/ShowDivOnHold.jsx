import { HelpOutline } from "@mui/icons-material";
import React, { useState } from "react";

const ShowDivOnHold = () => {
const [isHolding, setIsHolding] = useState(false);

const handleMouseDown = () => {
  // Set state to true when mouse/touch is pressed
  setIsHolding(true);
};

const handleMouseUp = () => {
  // Set state to false when mouse/touch is released
  setIsHolding(false);
};


  return (
    <>
      {/* Div che viene mostrato solo quando il mouse/touch è tenuto premuto */}
      {isHolding && (
        <div
          className="
        
          before:absolute before:-bottom-[6px] before:left-[160px] before:h-3 before:w-3 before:-rotate-45
          before:border-r before:border-t before:border-t-slate-700 before:border-r-slate-700 before:bg-inherit before:content-['']
          
         md:flex text-xs xs:text-sm text-slate-200 rounded-sm  absolute  bottom-12 w-52 xs:w-64 md:w-80 -translate-x-[142px]  bg-slate-700 p-4"
        >
         Enter your credit card code to confirm the payment method.
        </div>
      )}

      {/* Div su cui ascoltare gli eventi di mouse/touch */}
      <div
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        
        className={`p-3 cursor-pointer w-12 flex ${isHolding && " outline-dotted outline-slate-700"}`}
      >
        <HelpOutline />
      </div>
    </>
  );
};

export default ShowDivOnHold;
