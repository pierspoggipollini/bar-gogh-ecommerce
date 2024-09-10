import React, { useContext, useEffect, useState } from "react";
import { AddHomeOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { LayoutDashboard } from "../../../Layout/LayoutDashboard";
import { useShipFormContext } from "./ShipFormContext";
import { FormAddresses } from "./FormAddresses";

const ShipForm = () => {
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

  return (
    <>
      <LayoutDashboard selectedItem="addresses">
        <FormAddresses
          isLoadingComponent={isLoadingComponent}
          titleHeader="Add New Address"
          icon={<AddHomeOutlined fontSize="large" />}
          remove={false}
          shippingInfoValues={false}
          isDefaultAddress={false}
          actionTitle="Enter an address to save and ship the items to."
          saveFunction={(e) => submitNewAddress(e)}
          dashboardClass={
            "my-4 mx-3 md:m-0  relative h-full flex-col gap-2 md:flex w-full md:w-1/2 max-w-[32.5rem] lg:w-full"
          }
        />
      </LayoutDashboard>
    </>
  );
};

export default ShipForm;
