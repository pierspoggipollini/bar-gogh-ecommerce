import { DescriptionOutlined, LocalShippingOutlined } from "@mui/icons-material";
import { Skeleton } from "@mui/material";
import { RadioInput } from "../../Input/RadioInput";
import React from "react";

const AddressContainer = ({
  addressesWithDefaultShipping,
  modify,
  selectedId,
  handleChange,
  loading,
  isDefaultBilling,
  isDefaultShipping
}) => {
  return (
    <>
      {loading ? (
        <div className="relative flex gap-3 h-full mb-2 last:mb-0 flex-col w-full bg-slate-100  ">
          {addressesWithDefaultShipping.map((address, index) => (
            <React.Fragment key={address.id}>
              <ul className="flex relative justify-between max-w-xs text-sm xs:text-base lg:text-base flex-col flex-wrap gap-2">
                {[...Array(5)].map((_, i) => (
                  <React.Fragment key={i}>
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "1rem" }}
                      width={270}
                    />
                  </React.Fragment>
                ))}
                <div className="absolute top-0 -right-48">
                  <Skeleton variant="rectangular" width={110} height={30} />
                </div>
              </ul>

              {address.defaultShipping && (
                <div className="my-4 flex w-full">
                  <span className="flex items-center text-sm text-slate-500 gap-2">
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "1rem" }}
                      width={270}
                    />
                  </span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="relative flex gap-3 h-full mb-2 last:mb-0 flex-col w-full bg-slate-100  ">
          {addressesWithDefaultShipping.map((address, index) => (
            <React.Fragment key={address.id}>
              <ul className="flex max-w-xs text-sm xs:text-base lg:text-base flex-col flex-wrap gap-2">
                <li>{address.firstName}</li>
                <li>{address.lastName}</li>
                <li>{address.phone}</li>
                {address.newAddress.address.length > 0 ? (
                  <li>{address.fullAddress}</li>
                ) : (
                  <li className="w-full">{address.location}</li>
                )}
              </ul>

              {isDefaultShipping && address.defaultShipping && (
                <div className="mt-3 mb-4 flex w-full">
                  <span className="flex items-center text-sm text-slate-500 gap-2">
                    This is your default shipping address.{" "}
                    <LocalShippingOutlined />
                  </span>
                </div>
              )}

              {isDefaultBilling && address.defaultBilling && (
                <div className="mt-3 mb-4 flex w-full">
                  <span className="flex items-center gap-2 text-sm text-slate-500">
                    This is your default billing address.
                    <DescriptionOutlined />
                  </span>
                </div>
              )}
            </React.Fragment>
          ))}
          {modify && (
            <>
              <div className="absolute hidden md:block md:top-1/2 md:right-12 md:-translate-x-1/2 md:-translate-y-1/2">
                {addressesWithDefaultShipping.map((address, index) => (
                  <React.Fragment key={index}>
                    <RadioInput
                      valueRadio={address.id}
                      selectedValue={selectedId}
                      name={address.id}
                      onChange={() => handleChange(address.id)}
                    />
                  </React.Fragment>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AddressContainer;