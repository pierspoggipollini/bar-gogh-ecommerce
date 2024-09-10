import React from 'react'

import { NavLink } from 'react-router-dom';
import { ArrowBack, KeyboardBackspaceOutlined, ArrowBackIos, ArrowBackIosNew, ArrowBackIosNewOutlined, ArrowBackOutlined, CreditCard, CreditCardOutlined, KeyboardArrowLeftOutlined } from '@mui/icons-material';
import Paypal from "../../../../assets/paypal.svg"
import { DashHeader } from '../../Dashboard/DashHeader';


export const CheckoutSavePaymentForm = ({ click, nextStepCard }) => {
  return (
    <>
      <div className="relative h-full  bg-slate-100">
        <div className="hidden md:block mb-3  max-w-[300px]">
          <DashHeader
            /* backPage="/dashboard/payment-methods" */
            title=" Add New Payment Method"
            textStyle="lg:text-xl"
            dashHeight="md:h-12 mt-3 gap-0"
          />
        </div>
        <div className="my-3 flex gap-5  md:hidden  items-center">
          <NavLink to="/dashboard/payment-methods" className="m-0">
            <KeyboardBackspaceOutlined sx={{ fontSize: "2rem" }} />
          </NavLink>
          <h1 className="font-semibold uppercase  text-lg">
            Add New Payment Method
          </h1>
        </div>
        {/*  <h1 className="text-lg font-semibold leading-relaxed uppercase md:text-xl">
            Add a new Address
          </h1> */}
        <div className="mt-4">
          <span className=" text-sm leading-relaxed md:text-sm">
            Start by selecting the payment method you want to use.
          </span>
        </div>

        <div className="flex flex-col my-7  items-center">
          <button
            onClick={nextStepCard}
            className=" flex relative items-center gap-3 justify-center w-full md:w-72 h-12 border border-slate-400 bg-slate-200 p-3 text-center text-base font-semibold hover:bg-slate-300"
          >
            <span className="absolute left-3">
              <CreditCard />
            </span>
            Credit / Debit Card
          </button>

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
            className=" flex relative items-center justify-center w-full md:w-72 h-12 border border-slate-400 bg-slate-200 p-3 text-center text-base font-semibold hover:bg-slate-300"
          >
            <img src={Paypal} alt="paypal method" className=" w-24" />
          </NavLink>
        </div>
      </div>
    </>
  );
};
