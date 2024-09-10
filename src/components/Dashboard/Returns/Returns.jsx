import { AssignmentReturnOutlined, PersonOutline } from "@mui/icons-material";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { DashHeader } from "../DashHeader";

export const Returns = ({}) => {
  return (
    <>
      <DashHeader
       /*  backPage="/dashboard" */
        backIcon={<PersonOutline sx={{ fontSize: "1.8rem" }} />}
        title="Returns"
        icon={<AssignmentReturnOutlined fontSize="large" />}
      />

      <div className="flex h-64  max-w-full items-center justify-center gap-2 rounded-lg  bg-slate-100 p-4">
        <div className=" flex w-auto flex-col items-center gap-2 text-center ">
          <h1 className="text-base lg:text-lg font-semibold">
            Currently, you have no returns.
          </h1>
          <span className="text-sm lg:text-base">
            You can create a return from My Orders.
          </span>
          <NavLink
            className=" my-3 uppercase flex h-12 w-64 items-center justify-center rounded-md bg-primary-btn  p-2 font-semibold hover:bg-primary-hover"
            to="/dashboard/my-orders"
          >
            View My Orders
          </NavLink>
        </div>
      </div>
    </>
  );
};
