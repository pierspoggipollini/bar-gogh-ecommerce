import { ArrowBackIosOutlined } from "@mui/icons-material";
import React from "react";
import { useNavigate } from "react-router-dom";

export const GoBack = () => {
   const navigate = useNavigate();

   const handleBackButton = () => {
     navigate(-1); // Go back one page in the history
   };
  return (
    <>
      <button
        onClick={handleBackButton}
        className="hidden md:flex absolute left-4  top-6  items-center gap-1 text-xs md:left-auto md:right-4 md:top-0  rounded-full hover:bg-slate-200 p-2"
      >
        <ArrowBackIosOutlined fontSize="small" />
        Go Back
      </button>
    </>
  );
};
