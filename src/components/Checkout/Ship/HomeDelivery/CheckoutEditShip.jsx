import React, { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router";
import {
  INITIAL_STATE,
  shippingInfoReducer,
} from "../../../Dashboard/Address/EditShip/ShippingInfoReducer";
import "../../../Dashboard/Address/EditShip/ShippingInfoActionTypes";
import axiosInstance from "../../../../config/axiosInstance";
import { ACTION_TYPES } from "../../../Dashboard/Address/EditShip/ShippingInfoActionTypes";
import { useSelector } from "react-redux";
import { EditNoteOutlined } from "@mui/icons-material";
import { NavbarForm } from "../../../Navbar/NavbarForm";
import { deepEqual } from "../../../utilities/deepEqual";
import { useShipFormContext } from "../../../Dashboard/Address/Ship/ShipFormContext";
import { FormAddresses } from "../../../Dashboard/Address/Ship/FormAddresses";
import { ScrollRestoration } from "react-router-dom";
import { NavigateButton } from "../../../Dashboard/NavigateButton";

const CheckoutEditShip = () => {
  const { id } = useParams();

  const {
    shipValue,
    setShipValue,
    shippingValue,
    setManuallyAddress,
    isAllRequiredFieldsFilled,
    activeFinalForm,
    manuallyAddress,
    updateManualAddress,
    updateValidity,
    updateAddress,
    isSaved,
    setIsSaved,
    isSaving,
    setIsSaving,
    showConfirmation,
    setShowConfirmation,
    dataIsEqual,
    setDataIsEqual,
    addressValue,
    checkboxValue,
    validity,
    errorForm,
    isFormValid,
    addresses,
    handleChange,
    handleSelectChange,
    handleResetQuery,
    removeLocation,
    saveLocation,
    deleteAddress,
  } = useShipFormContext();

  const { user } = useSelector((state) => state.userAuth);

  const [isLoadingComponent, setIsLoadingComponent] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoadingComponent(false);
    }, 500);
  }, []);

  const uid = user.uid;

  const [state, localDispatch] = useReducer(shippingInfoReducer, INITIAL_STATE);

  useEffect(() => {
    localDispatch({ type: ACTION_TYPES.FETCH_SHIPPING_INFO_REQUEST });
    axiosInstance
      .get(`dashboard/ship-info/${id}`)
      .then((response) =>
        localDispatch({
          type: ACTION_TYPES.FETCH_SHIPPING_INFO_SUCCESS,
          payload: response.data,
        }),
      )
      .catch((error) =>
        localDispatch({
          type: ACTION_TYPES.FETCH_SHIPPING_INFO_FAILURE,
          payload: error,
        }),
      );
  }, []);

  const shippingInfoValues =
    state && state.shippingInfo
      ? state.shippingInfo.reduce((acc, currentInfo) => {
          const {
            firstName = "",
            lastName = "",
            phone = "",
            location = "",
            newAddress: {
              address: newAddress = "",
              country = "",
              city: newCity = "",
              state: newState = "Select State*",
              zipcode: newZipCode = "",
            } = {},

            defaultShipping = false,
            defaultBilling = false,
          } = currentInfo;

          return {
            ...acc,
            firstName: firstName || "",
            lastName: lastName || "",
            phone: phone || "",
            location: location || "",
            newAddress: {
              address: newAddress || "",
              country: country || "",
              city: newCity || "",
              state: newState,
              zipCode: newZipCode || "",
            },
            defaultShipping,
            defaultBilling,
          };
        }, {})
      : {};

  // Check if both defaultShipping and defaultBilling properties are true in the combined shipping information object.
  const isDefaultAddress =
    shippingInfoValues.defaultBilling && shippingInfoValues.defaultShipping;

  const areDataEqual = () => {
    return Object.keys(shippingInfoValues).every((key) => {
      // Verifica se l'oggetto contiene newAddress
      if (
        key === "newAddress" &&
        shippingInfoValues.newAddress &&
        shipValue.newAddress
      ) {
        // Confronta i valori all'interno di newAddress uno per uno
        return deepEqual(shippingInfoValues.newAddress, shipValue.newAddress);
      } else if (key !== "newAddress") {
        // Confronta direttamente i valori corrispondenti diversi da newAddress
        return shippingInfoValues[key] === shipValue[key];
      } else {
        // In caso contrario, restituisci true per evitare di interrompere il loop
        return false;
      }
    });
  };

  useEffect(() => {
    setDataIsEqual(areDataEqual());
  }, [shippingInfoValues, shipValue, dataIsEqual]);

  useEffect(() => {
    // Update the module state when shipValue.location or manuallyAddress changes
    updateManualAddress();
  }, [manuallyAddress, activeFinalForm, shipValue.location]);

  useEffect(() => {
    // Update the module validity when isAllRequiredFieldsFilled or manuallyAddress changes
    updateValidity();
  }, [isAllRequiredFieldsFilled, manuallyAddress]);

  useEffect(() => {
    // Update shipValue with the values extracted from state.shippingInfo
    setShipValue({
      ...shipValue, // Preserve existing shipValue properties
      ...shippingInfoValues, // Incorporate new properties from shippingInfoValues, ensuring no duplication of values
    });
  }, [state.shippingInfo]);

  useEffect(() => {
    if (
      shipValue.newAddress.address &&
      shipValue.newAddress.zipCode &&
      shipValue.newAddress.state &&
      shipValue.newAddress.city
    ) {
      setManuallyAddress(true);
    }
  }, [
    shipValue.newAddress.address,
    shipValue.newAddress.zipCode,
    shipValue.newAddress.state,
    shipValue.newAddress.city,
  ]);

  /*   const confirmDelete = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const cancelConfirmDelete = (e) => {
    e.preventDefault();
    setShowConfirmation(false);
  };
 */
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
            backPage="/checkout"
            titleHeader="Modify address"
            icon={<EditNoteOutlined fontSize="large" />}
            backPath="/checkout"
            actionTitle="Updating the address will cause all future shipment labels to
                appear exactly as the one below."
            saveFunction={(e) => updateAddress(e, id)}
            isDefaultAddress={isDefaultAddress}
            remove={true}
            addressId={id}
            shippingInfoValues={shippingInfoValues}
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

export default CheckoutEditShip;
