import { createSlice } from "@reduxjs/toolkit";
import { setError } from "./user-auth";
import { revertAll } from "./revertAll";
import axiosInstance from "../config/axiosInstance";

export const fetchCreditCardsData = () => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.get(`dashboard/credit-cards`)
            const { success, creditCards } = response.data;

            if (success) {
                dispatch(addPayment(creditCards))
            }

        } catch (error) {
            console.log("Error fetching credit cards info:", error.message)
            if (error.response.status === 401) {
                dispatch(setError("Session expired."));
            }
        }
    }
}

// Creating a Redux slice for saved payments
export const savedPaymentSlice = createSlice({
    name: "savedPayments",
    initialState: [], // Initializing the initial state as an empty array
    reducers: {
        // Defining a reducer named "addPayment"
        addPayment: (state, action) => {
            // Updating the state by returning the payload from the action
            return action.payload;
        }
    },
    extraReducers: (builder) =>
        builder.addCase(revertAll, () => []),

})

export const { addPayment } = savedPaymentSlice.actions
export default savedPaymentSlice.reducer;