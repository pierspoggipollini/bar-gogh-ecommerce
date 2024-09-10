import React, { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router";
import { INITIAL_STATE, shippingInfoReducer } from "./ShippingInfoReducer";
import "./ShippingInfoActionTypes";
import { ACTION_TYPES } from "./ShippingInfoActionTypes";
import { useSelector } from "react-redux";
import { EditNoteOutlined } from "@mui/icons-material";
import { deepEqual } from "../../../utilities/deepEqual";
import { useShipFormContext } from "../Ship/ShipFormContext";
import { LayoutDashboard } from "../../../Layout/LayoutDashboard";
import { FormAddresses } from "../Ship/FormAddresses";
import axiosInstance from "../../../../config/axiosInstance";

const EditShipForm = () => {
  const { id } = useParams();

  const {
    shipValue,
    setShipValue,
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
  }, [shipValue]);

  /*   const confirmDelete = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const cancelConfirmDelete = (e) => {
    e.preventDefault();
    setShowConfirmation(false);
  }; */

  return (
    <LayoutDashboard selectedItem="addresses">
      <FormAddresses
        backPage="/dashboard/addresses"
        titleHeader="Modify address"
        icon={<EditNoteOutlined fontSize="large" />}
        backPath="/dashboard/addresses"
        actionTitle="Updating the address will cause all future shipment labels to
                appear exactly as the one below."
        saveFunction={(e) => updateAddress(e, id)}
        isDefaultAddress={isDefaultAddress}
        remove={true}
        addressId={id}
        shippingInfoValues={shippingInfoValues}
        dashboardClass={
          "my-4 mx-3 md:m-0  relative h-full flex-col gap-2 md:flex w-full md:w-1/2 max-w-[32.5rem] lg:w-full"
        }
      />
    </LayoutDashboard>
  );
};

export default EditShipForm;
