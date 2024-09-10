import React, { useEffect, useState } from "react";
import { AddHomeOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { FormAddresses } from "../../../Dashboard/Address/Ship/FormAddresses";
import { useShipFormContext } from "../../../Dashboard/Address/Ship/ShipFormContext";
import { NavigateButton } from "../../../Dashboard/NavigateButton";
import { NavbarForm } from "../../../Navbar/NavbarForm";
import { ScrollRestoration } from "react-router-dom";
import Breadcrumb from "../../../../BreadCrumb";

const CheckoutShipForm = ({}) => {
  const {
    isFormValid,
    shipValue,
    manuallyAddress,
    activeFinalForm,
    submitNewAddress,
    isAllRequiredFieldsFilled,
    resetFormErrors,
    updateManualAddress,
    updateValidity,
  } = useShipFormContext();

  // Retrieve user information from Redux state
  const user = useSelector((state) => state.userAuth.user);
  // Set up state to manage loading status
  const [isLoadingComponent, setIsLoadingComponent] = useState(true);

  // Simulate loading for 500 milliseconds
  useEffect(() => {
    setTimeout(() => {
      setIsLoadingComponent(false); // Set loading state to false after 500 milliseconds
    }, 500);
  }, []);

  useEffect(() => {
    // Update the form errors when isFormValid changes
    resetFormErrors();
  }, [isFormValid]);

  useEffect(() => {
    // Update the module state when shipValue.location or manuallyAddress changes
    updateManualAddress();
  }, [manuallyAddress, activeFinalForm, shipValue.location]);

  useEffect(() => {
    // Update the module validity when isAllRequiredFieldsFilled or manuallyAddress changes
    updateValidity();
  }, [isAllRequiredFieldsFilled, manuallyAddress]);

  const buttons = [
    {
      to: "/dashboard/addresses",
      title: "go to your addresses",
      openInNewTab: false,
    },
    {
      to: "/dashboard",
      title: "go to dashboard",
      openInNewTab: false,
    },
  ];

  return (
    <div>
      <NavbarForm />
      <div className="flex xl:gap-0 my-4  flex-col lg:flex-row sm:items-center lg:items-start  lg:justify-evenly">
        <div className=" max-w-full md:w-[35rem] xl:w-[40rem]  ">
          <FormAddresses
            isLoadingComponent={isLoadingComponent}
            titleHeader="Add New Address"
            icon={<AddHomeOutlined fontSize="large" />}
            backPath="/dashboard/addresses"
            actionTitle="Enter an address to save and ship the items to."
            saveFunction={(e) => submitNewAddress(e)}
            isDefaultAddress={false}
            remove={false}
            shippingInfoValues={false}
          />
        </div>
        <div className=" sticky top-4 h-full  m-3 p-6 xl:p-8 max-h-72 overflow-hidden max-w-md md:min-w-[25rem]  w-auto  lg:min-w-[26rem] xl:min-w-[28.125rem] flex flex-col gap-6 bg-slate-100 rounded-lg ">
          {buttons.map((button) => (
            <NavigateButton
              key={button.to}
              to={button.to}
              title={button.title}
              openInNewTab={button.openInNewTab}
            />
          ))}
        </div>
      </div>
      <ScrollRestoration />
    </div>
  );
};

export default CheckoutShipForm;
