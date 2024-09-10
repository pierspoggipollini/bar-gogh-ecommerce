import { KeyboardArrowRightOutlined } from "@mui/icons-material";
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      className="bg grid grid-rows-2 place-items-center gap-3 bg-primary p-12"
      role="alert"
    >
      <h1 className="text-lg" aria-live="assertive">
        Not Found
      </h1>
      <div className="flex w-48 items-center gap-1" aria-live="polite">
        <KeyboardArrowRightOutlined />
        <span>
          Back to{" "}
          <Link to="/home" className="underline underline-offset-2">
            homepage
          </Link>
        </span>
      </div>
    </div>
  );
};

export default NotFound;

