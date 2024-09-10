import {
  ArrowBackOutlined,
  KeyboardArrowLeftOutlined,
  KeyboardBackspaceOutlined,
  PersonOutline,
} from "@mui/icons-material";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { GoBack } from "./GoBack";

const Icon = ({ icon }) => <span className="hidden md:block">{icon}</span>;

const BackIconBtn = ({ icon, click, link, backIconStyle }) => (
  <>
    <button
      onClick={click}
     
      className={twMerge(
        ` flex absolute left-0 bg-slate-100 p-2  md:hidden`,
        backIconStyle,
      )}
    >
      {icon}
    </button>
  </>
);

export const DashHeader = ({
  title,
  icon,
  backPage,
  textStyle,
  dashHeight,
}) => {

const navigate = useNavigate();

   const handleBackButton = () => {
     navigate(-1); // Go back one page in the history
   };

  return (
    <div className="w-auto h-auto p-2 md:w-full md:border-none  rounded-lg bg-slate-100">
      <div
        className={`w-full  md:justify-normal 
        flex flex-col flex-wrap  justify-center`}
      >
        <div
          className={twMerge(
            `flex min-h-10 relative max-w-full flex-wrap items-center justify-center md:justify-normal gap-3 `,
            dashHeight,
          )}
        >
          {/* */}
          {backPage && <GoBack />}
          <BackIconBtn
            click={handleBackButton}
            icon={
              <div className="flex items-center">
                <KeyboardBackspaceOutlined sx={{ fontSize: "2rem" }} />
              </div>
            }
          />

          <h1
            className={twMerge(
              ` text-base px-8 md:px-2 text-center md:text-left max-w-full w-64 xs:w-full md:max-w-full lg:max-w-[30rem] text-balance uppercase flex justify-center md:justify-normal  items-center ${icon ? "gap-3" : ""}  font-semibold lg:text-lg`,
              textStyle,
            )}
          >
            <Icon icon={icon} />
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
};
