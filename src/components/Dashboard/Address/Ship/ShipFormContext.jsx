// ShipFormContext.js

import React, { createContext, useContext } from "react";

// Create a new context for form functions
const ShipFormContext = createContext();

// Custom hook to use the form context
export const useShipFormContext = () => useContext(ShipFormContext);

export default ShipFormContext;
