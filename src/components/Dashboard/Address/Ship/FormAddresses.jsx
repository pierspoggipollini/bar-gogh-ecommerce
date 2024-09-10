import React from "react";
import Input from "../../../Input/Input";
import { PhoneNumberInput } from "./PhoneNumberInput";
import { motion } from "framer-motion";
import CountrySelector from "./CountrySelector";
import { FindAddress } from "./FindAddress";
import { CheckboxInput } from "../../../Input/CheckboxInput/CheckboxInput";
import { StateSelect } from "./StateSelect";
import { SaveButton } from "../../SaveButton";
import { DashHeader } from "../../DashHeader";
import { GoBack } from "../../GoBack";
import { useShipFormContext } from "./ShipFormContext";
import { RemoveShippingInfoButton } from "./RemoveShippingInfoButton";
import { Skeleton } from "@mui/material";
import {
  DescriptionOutlined,
  Edit,
  LocalShippingOutlined,
} from "@mui/icons-material";
import { twMerge } from "tailwind-merge";

export const FormAddresses = ({
  addressId,
  titleHeader,
  icon,
  actionTitle,
  saveFunction,
  isDefaultAddress,
  shippingInfoValues,
  remove,
  isLoadingComponent,
  dashboardClass,
}) => {
  const {
    shippingValue,
    addressValue,
    checkboxValue,
    shipValue,
    setShipValue,
    setManuallyAddress,
    validity,
    errorForm,
    activeFinalForm,
    isFormValid,
    manuallyAddress,
    addresses,
    handleChange,
    handleSelectChange,
    handleResetQuery,
    removeLocation,
    saveLocation,
    deleteAddress,
    dataIsEqual,
    hasDefault,
    handleCountryChange,
    formattedPhoneNumber
  } = useShipFormContext();

  /* const navigate = useNavigate()

  const handleBackButton = () => {
    navigate(-1); // Go back one page in the history
  }; */

  return (
    <>
      <div className={twMerge("m-3", dashboardClass)}>
        <div className="h-auto relative max-w-full w-full flex bg-slate-100 flex-col  rounded-lg ">
          <DashHeader backPage={true} title={titleHeader} icon={icon} />

          {/*  <h1 className="text-lg font-semibold leading-relaxed uppercase md:text-xl">
            Modify address
          </h1> */}
          <div className=" h-auto bg-slate-100  rounded-lg  max-w-full">
            <div className="flex flex-col gap-3 px-3">
              <span className=" text-sm leading-relaxed">{actionTitle}</span>
              {/* Updating the address will cause all future shipment labels to
              appear exactly as the one below. */}

              <span className="text-xs">
                The fields marked with an asterisk (*) are required.
              </span>
            </div>

            {isLoadingComponent && (
              <>
                <div className=" h-auto max-w-[27.5rem] overflow-scroll  md:max-w-sm flex flex-col pt-5 pb-2">
                  <div className="flex flex-col min-w-48 xs:w-full px-4 pt-5 pb-2 gap-x-3 gap-y-7 ">
                    {[...Array(4).keys()].map((_, i) => (
                      <React.Fragment key={i}>
                        <Skeleton
                          variant="rectangular"
                          width="100%"
                          height={60}
                        />
                      </React.Fragment>
                    ))}
                    {[...Array(2).keys()].map((_, i) => (
                      <React.Fragment key={i}>
                        <Skeleton variant="text" width="100%" height={50} />
                      </React.Fragment>
                    ))}
                    {[...Array(1).keys()].map((_, i) => (
                      <React.Fragment key={i}>
                        <Skeleton variant="rounded" width="100%" height={60} />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </>
            )}
            {!isLoadingComponent && (
              <div className="flex flex-col ">
                <form
                  id="addresses"
                  noValidate
                  className=" h-auto max-w-[27.5rem] overflow-scroll  md:max-w-sm flex flex-col px-4 pt-5 pb-2"
                >
                  <div className="flex flex-col xs:w-full  gap-x-3 gap-y-7 ">
                    {shippingValue.map((input) => {
                      return (
                        <React.Fragment key={input.name}>
                          <Input
                            type={input.type}
                            label={input.label}
                            required={input.required}
                            placeholder={input.placeholder}
                            error={!validity[input.name]}
                            name={input.name}
                            value={shipValue[input.name]}
                            onInputChange={handleChange}
                          />
                        </React.Fragment>
                      );
                    })}

                   {/*  <PhoneNumberInput
                      phoneValue={shipValue.phone}
                      isPhoneValid={validity["phone"]}
                      onPhoneChange={(phoneValue) =>
                        handleChange({
                          target: { value: phoneValue, name: "phone" },
                        })
                      }
                    /> */}
                  </div>{" "}
                  {/* //1 grid */}
                  <div className="mt-7 ">
                    <FindAddress
                      query={shipValue.query}
                      country={shipValue.newAddress.country}
                      location={shipValue.location}
                      onClick={() => {
                        setShipValue({ ...shipValue, query: "" });
                      }}
                      handleInputChange={handleChange}
                      addLocation={saveLocation}
                      onResetQuery={handleResetQuery}
                      removeLocation={removeLocation}
                      validity={shipValue.location ? true : validity["query"]}
                      errorMessage={errorForm.findAddress}
                    />
                  </div>
                  {!shipValue.location ? (
                    <div className=" flex pt-7 ">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        role="button"
                        title="Toggle manual address input"
                        aria-label="Toggle manual address input"
                        onClick={(e) => {
                          e.preventDefault();
                          setManuallyAddress(!manuallyAddress);
                        }}
                        className="text-xs bg-slate-200 hover:bg-slate-300 w-full h-full rounded-sm p-3 text-left xs:text-sm"
                      >
                        {!manuallyAddress
                          ? "Click here to enter the address manually."
                          : "Click here to hide the address manually."}
                      </motion.button>
                    </div>
                  ) : (
                    <></>
                  )}
                  {manuallyAddress && (
                    <div className="flex flex-col ">
                      {shipValue.location && (
                        <div className="text-base py-4">or</div>
                      )}
                      <div
                        className={`flex flex-col min-w-48 xs:w-full  ${!shipValue.location && "pt-7"} gap-x-3 gap-y-7`}
                      >
                        {addressValue.map((input) => (
                          <div className=" md:w-full" key={input.name}>
                            <Input
                              type={input.type}
                              label={input.label}
                              required={input.required}
                              placeholder={input.placeholder}
                              initialValidity={validity.newAddress[input.name]}
                              name={`newAddress.${input.name}`}
                              value={shipValue.newAddress[input.name]}
                              error={errorForm[input.name]} // Aggiungi l'errore corrispondente
                              onInputChange={handleChange}
                            />
                          </div>
                        ))}
                        <CountrySelector
                          country={shipValue.newAddress.country}
                          handleCountry={handleCountryChange}
                        />

                        <StateSelect
                          country={shipValue.newAddress.country}
                          selectedState={shipValue.newAddress.state}
                          handleSelectChange={handleSelectChange}
                          isStateValid={validity.newAddress.state === true}
                          defaultOption={shipValue.newAddress.state}
                        />
                      </div>
                    </div>
                  )}
                  {activeFinalForm && (
                    <div className={`flex h-auto w-full  flex-col  py-7 gap-5`}>
                      {shippingInfoValues &&
                        shippingInfoValues.defaultShipping && (
                          <div className="flex  items-center text-xs xs:text-sm text-balance text-slate-600 ga">
                            <span>This is your default shipping address. </span>

                            <span className="ml-auto">
                              <LocalShippingOutlined />
                            </span>
                          </div>
                        )}
                      {shippingInfoValues &&
                        shippingInfoValues.defaultBilling && (
                          <div className="flex items-center text-xs ga xs:text-sm text-balance text-slate-700">
                            <span> This is your default billing address.</span>

                            <span className="ml-auto">
                              <DescriptionOutlined />
                            </span>
                          </div>
                        )}

                      {checkboxValue.map((input, index) => {
                        if (
                          (input.name === "defaultShipping" &&
                            shippingInfoValues.defaultShipping) ||
                          (input.name === "defaultBilling" &&
                            shippingInfoValues.defaultBilling)
                        ) {
                          // Se il nome del checkbox corrisponde a una condizione vera, nascondilo.
                          return null;
                        }

                        return (
                          <div className="flex flex-col  gap-6" key={index}>
                            <CheckboxInput
                              name={input.name}
                              label={input.label}
                              onInputChange={handleChange}
                              checked={shipValue[input.name]}
                              aria={shipValue[input.name]}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {/* <div className="md:w-1/2    "></div> */}
                  {/* 2 grid */}
                  <div className="flex pb-5  flex-col gap-4 ">
                    <SaveButton
                      saveFunction={(e) => saveFunction(e)}
                      isFormValid={isFormValid}
                      disabled={dataIsEqual === true}
                      icon={<Edit />}
                    />
                    {remove && (
                      <RemoveShippingInfoButton
                        remove={() => deleteAddress(addressId)}
                        disabled={isDefaultAddress}
                      />
                    )}

                    {errorForm.general && (
                      <span className="text-sm text-red-700">
                        {errorForm.general}
                      </span>
                    )}
                  </div>
                </form>
                {isDefaultAddress && shippingInfoValues && (
                  <div className="flex px-4 pb-4 pt-1">
                    <span className="text-sm">
                      To delete it, you must first add a new address and set it
                      as the default billing and shipping address.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
