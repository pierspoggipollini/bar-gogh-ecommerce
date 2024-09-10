import React, { useState } from "react";
import { getData } from "country-list";
import { useDispatch, useSelector } from "react-redux";
import { updateCountry } from "../../../../store/shippingData";
import { ShipSelect } from "./ShipSelect";

const countriesData = getData();

const CountrySelector = ({country, handleCountry}) => {
  const dispatch = useDispatch();

  // Usa useSelector per accedere allo stato globale
  /* const country = useSelector((state) => state.shippingData.country); */

  const handleSelect = (e) => {
    const selectedCountry = e.target.value;
    handleCountry(selectedCountry)

    // Aggiorna lo stato globale dei dati di spedizione
    /* dispatch(updateCountry({ country: selectedCountry })); */
  };

  return (
    <div className={`flex h-auto w-full items-center ${country ? "gap-3" : "gap-0"}`}>
      {/* Renderizza le icone delle bandiere */}
      <img
        alt={country}
        src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${country}.svg`}
        className=" h-8 w-auto rounded-full"
      />
      <ShipSelect
        defaultValue={country}
        selectedValue={country}
        disabled={true}
        options={countriesData}
        valueKey="code"
        nameKey="name"
        handleSelect={handleSelect}
        defaultOption="Select a country"
        label="Country*"
        isStateValid={true}
        id={"country-select"}
      />
    </div>
  );
};

export default CountrySelector;
