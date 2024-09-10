import { createSlice } from "@reduxjs/toolkit";
import { applyDiscount, cartSlice } from "./cart";
import { revertAll } from "./revertAll";
import { capitalizeFirstLetter } from "../components/utilities/capitalizeFirstLetter";


function addBusinessDays(startDate, daysToAdd) {
    // Create a copy of the start date to avoid modifying the original date object
    const targetDate = new Date(startDate);

    // Loop through the days to add
    for (let i = 0; i < daysToAdd;) {
        // Increment the date by one day
        targetDate.setDate(targetDate.getDate() + 1);

        // Skip Saturdays (6) and Sundays (0)
        if (targetDate.getDay() !== 0 && targetDate.getDay() !== 6) {
            // Increment the counter only if it's not a weekend day
            i++;
        }
    }

    // Return the resulting date after adding the specified business days
    return targetDate;
}

// Get the current date
const today = new Date();

// Calculate the date in 4 business days for standard delivery
const standardDeliveryDate = addBusinessDays(today, 4);



// Format the date in the desired format for standard delivery in English
const standardFormattedDeliveryDate = standardDeliveryDate.toLocaleDateString(
    'en-US', // Change 'en-US' to 'en-GB' if you want British English format
    {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    },
);

// Initial state for the checkout feature
export const checkoutInitialState = {
    orderId: "",                              // Order ID
    items: JSON.parse(sessionStorage.getItem("cartItems")) || [],  // Items in the cart, retrieved from sessionStorage or an empty array
    totalOrder: 0,                            // Total cost of the order
    shipAddress: {},                          // Shipping address
    /*  expectedDeliveryDate: "", */                 // Expected Delivery Date
    billingAddress: {},                       // Billing address
    shippingOption: {
        standard: {
            type: "Standard Shipping",
            expectedShipDate: capitalizeFirstLetter(standardFormattedDeliveryDate),
        }
    }
}

// Slice for managing checkout state using Redux Toolkit
export const checkoutSlice = createSlice({
    name: "checkout",                         // Slice name
    initialState: checkoutInitialState,       // Initial state for checkout
    reducers: {
        addIdOrder: (state, action) => {
            state.orderId = action.payload;   // Action to set the order ID
        },
        addShipAddress: (state, action) => {
            state.shipAddress = action.payload; // Action to set the shipping address
        },
        /*  AddExpectedDeliveryDate: (state, action) => {
             state.expectedDeliveryDate = action.payload;
         }, */
        updateShippingOptions: (state, action) => {
            state.shippingOption = {
                [action.payload.name]: {
                    type: action.payload.type,
                    expectedShipDate: action.payload.expectedShipDate,
                },
            };
        },

        addBillingAddress: (state, action) => {
            state.billingAddress = action.payload; // Action to set the billing address
        },
        addPaymentMethod: (state, action) => {
            state.paymentMethod = action.payload; // Action to set the payment method (missing in initial state)
        },
        resetCheckout: (state) => {
            // Action to reset checkout state to initial values or empty
            state.idOrder = "";
            /*  state.items = [];
                state.totalOrder = 0; */
        },
    },
    extraReducers: (builder) =>
        builder.addCase(revertAll, () => checkoutInitialState),

});

// Extracting action creators from the slice
export const { addIdOrder, addShipAddress,/*  AddExpectedDeliveryDate, */ updateShippingOptions, addBillingAddress, addPaymentMethod, resetCheckout } = checkoutSlice.actions;

// Exporting the reducer from the slice
export default checkoutSlice.reducer;
