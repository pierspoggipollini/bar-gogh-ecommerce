import React, { useEffect, useState } from "react";
import { ShipSelect } from "./ShipSelect";
import { State } from "country-state-city";

export const StateSelect = ({
  selectedState,
  handleSelectChange,
  isStateValid,
  country,
}) => {

  const [filteredStates, setFilteredStates] = useState([]);

  useEffect(() => {
    const validateStates = State.getStatesOfCountry(country);
    const filteredValidStates = validateStates.filter(
      (state) => !/\d/.test(state.isoCode),
    );
    const filteredValidStatesAndSorted = filteredValidStates.sort(
      (stateA, StateB) => stateA.isoCode.localeCompare(StateB.isoCode),
    );
    setFilteredStates(filteredValidStatesAndSorted);
  }, [country]);

  return (
    <>
      <ShipSelect
        label="Select State*"
        selectedValue={selectedState}
        handleSelect={handleSelectChange}
        options={filteredStates}
        nameKey="isoCode"
        valueKey="isoCode"
        isStateValid={isStateValid}
        id="state-select"
      />
    </>
  );
};
