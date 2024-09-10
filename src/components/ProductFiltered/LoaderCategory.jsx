import React from "react";
import "./loaderCategory.css";
import { Skeleton } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

export const LoaderCategory = ({color}) => {

  return (
    <>
      <div className="my-10 mx-2 flex md:justify-center">
        <div className="flex text-sm md:hidden text-slate-100">
          <NavigateBeforeIcon style={color} fontSize="small" />
          <Skeleton
            variant="text"
            animation="pulse"
            sx={{ fontSize: "1.125rem", bgcolor: "grey.400" }}
            width={30}
          />
        </div>

        <ul className="hidden bg-slate-200 rounded-[2.5rem] shadow-lg px-8 max-w-[50rem]  cursor-pointer gap-6 md:flex md:flex-row">
          {[...Array(5)].map((_, i) => (
            <li key={i} className="px-2 py-4 mx-1 w-24  max-w-32">
              <Skeleton
                variant="text"
                animation="pulse"
                sx={{ fontSize: "1.125rem", bgcolor: "grey.400" }}
                width="100%"
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
