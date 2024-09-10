import React from "react";
import { LayoutDashboard } from "../../Layout/LayoutDashboard";
import { DashHeader } from "../DashHeader";
import { NavLink } from "react-router-dom";
import {
  CreditCard,
} from "@mui/icons-material";
import Paypal from "../../../assets/paypal.svg";

const SavePaymentForm = () => {
  return (
    <>
      <LayoutDashboard selectedItem={"payment-methods"}>
        <div className="my-4 mx-3 md:m-0  relative h-full flex-col gap-2 flex w-full md:w-1/2 max-w-[32.5rem] lg:w-full">
          <DashHeader
            backPage={true}
            title=" Add New Payment Method"
            textStyle="xs:w-72 sm:w-full"
          />

          {/* <div className="my-3 flex gap-5  md:hidden  items-center">
            <NavLink to="/dashboard/payment-methods" className="m-0">
              <KeyboardBackspaceOutlined sx={{ fontSize: "2rem" }} />
            </NavLink>
            <h1 className="font-semibold uppercase  text-lg">
              Add New Payment Method
            </h1>
          </div> */}
          {/*  <h1 className="text-lg font-semibold leading-relaxed uppercase md:text-xl">
            Add a new Address
          </h1> */}
          <div className="  p-4 h-auto flex flex-col bg-slate-100 rounded-lg gap-3 md:mx-0 max-w-full">
            <span className=" text-sm text-pretty leading-relaxed">
              Start by selecting the payment method you want to use.
            </span>

            <div className="flex flex-col my-7  items-center">
              <NavLink
                to="card"
                className=" flex uppercase flex-wrap relative items-center gap-3 justify-center w-full md:w-72 min-h-12 border border-slate-400 bg-slate-200 p-3 text-center text-sm xs:text-base font-semibold rounded-lg hover:bg-slate-300"
              >
                <span className="absolute left-3">
                  <CreditCard />
                </span>
                Credit / Debit Card
              </NavLink>

              <div
                className="  flex  w-full  border-none py-6  text-xs 
                 before:m-0 before:h-2 before:flex-1 before:flex-shrink-0 before:border-b before:border-solid before:border-slate-400 before:content-[''] 
                after:m-0 after:h-2 after:flex-1 after:flex-shrink-0 after:border-b after:border-solid after:border-slate-400 after:content-[''] "
              >
                <span className="m-0 flex-[0.5] xs:flex-[0.3] lg:flex-[0.2] flex-shrink-0 text-center uppercase">
                  or
                </span>
              </div>
              <NavLink
                to="card"
                className=" flex relative items-center justify-center w-full md:w-72 h-12 border border-slate-400 bg-slate-200 p-3 text-center text-base font-semibold rounded-lg hover:bg-slate-300"
              >
                <img src={Paypal} alt="paypal method" className=" w-24" />
              </NavLink>
            </div>
          </div>
        </div>
      </LayoutDashboard>
    </>
  );
};

export default SavePaymentForm;
