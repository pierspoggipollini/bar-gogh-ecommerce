import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setError } from "./user-auth";
import { revertAll } from "./revertAll";
import axiosInstance from "../config/axiosInstance";

export const fetchLocation = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get("https://ipapi.co/json", { withCredentials: false });
      const { country } = response.data;

      if (!localStorage.getItem("country")) {
        localStorage.setItem("country", country);
        dispatch(updateCountry({ country: country }));
      } else {
        dispatch(updateCountry({ country: localStorage.getItem("country") }));
      }
    } catch (error) {
      console.error("Error fetching location:", error.message);
    }
  };
};

export const fetchShippingData = () => {
  return async (dispatch) => {
    try {

      const response = await axiosInstance.get(`dashboard/ship-info`)

      const { success, address } = response.data;

      if (success) {
        dispatch(addAddress(address))
      }

    } catch (error) {
      console.log("Error fetching shipping info:", error.message)
      if (error.response.status === 401) {
        dispatch(setError("Session expired."));
      }
    }
  }
}


const initialState = {
  country: "",
  addresses: [],
}

export const shippingDataSlice = createSlice({
  name: "shippingData",
  initialState: initialState,
  reducers: {
    updateCountry: (state, action) => {
      state.country = action.payload.country
    },
    addAddress: (state, action) => {
      const newAddress = action.payload;
      state.addresses = newAddress

      /*   // Verifica se l'indirizzo è già presente nell'array addresses
        const existingAddress = state.addresses.some(address => (
          address.address === newAddress.address &&
          address.city === newAddress.city &&
          address.state === newAddress.state &&
          address.zipcode === newAddress.zipcode
        ));
  
        // Aggiungi l'indirizzo solo se non esiste già
        if (!existingAddress) {
          state.addresses = newAddress;
        } */
    },
    addName: (state, action) => {
      const { firstName, lastName } = action.payload;
      state.firstName = firstName;
      state.lastName = lastName;
    },
    addPhone: (state, action) => {
      state.phone = action.payload.phone
    },
    /*    addLocation: (state, action) => {
         state.location = action.payload
       },
       removeLocation: (state) => {
         state.location = ""
       }, */

    updateAddress: (state, action) => {
      const { addressIndex, address } = action.payload;
      state.addresses[addressIndex] = {
        ...state.addresses[addressIndex],
        ...address,
      };
    },
    setDefaultAddress: (state, action) => {
      const { addressIndex } = action.payload;
      state.addresses.forEach((address, index) => {
        address.defaultShipping = index === addressIndex;
      });

      state.addresses = state.addresses.map((address, index) => ({
        ...address,
        defaultShipping: index === addressIndex,
      }));
    }
  },
  extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
});

// Export the action creator
export const { addName, addPhone, updateCountry, addLocation, addAddress, updateAddress, setDefaultAddress, removeLocation } = shippingDataSlice.actions;

export default shippingDataSlice.reducer;
