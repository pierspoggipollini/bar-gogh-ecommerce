/* Redux Reducer */
import { combineReducers, configureStore } from "@reduxjs/toolkit";

import userAuthReducer from "./store/user-auth";
import wishlistReducer from "./store/wishlist";
import bestsellerReducer from "./store/bestseller";
import latestReducer from "./store/latest";
import productsReducer from "./store/products";
import cartReducer from "./store/cart";
import shippingDataReducer from "./store/shippingData";
import savedPaymentReducer from "./store/savedPayments";
import checkoutReducer from "./store/checkout";

import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import { persistReducer, persistStore } from "redux-persist";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";

import storage from "redux-persist/lib/storage";

// Configuration object for Redux persist, specifying how to persist Redux state.
const persistConfig = {
  key: "root", // Key under which the persisted state will be stored in local storage.
  storage, // Type of storage to use (e.g., localStorage, sessionStorage).
  stateReconciler: autoMergeLevel2, // Method for reconciling state between persistence and initial state.
  /* whitelist: ["userAuth"], */ // Array of reducers to whitelist for persistence (currently commented out).
};

// Combined root reducer that merges all individual reducers into one root state.
const rootReducer = combineReducers({
  userAuth: userAuthReducer, // Reducer managing authentication state.
  wishlist: wishlistReducer, // Reducer managing wishlist-related state.
  bestsellers: bestsellerReducer, // Reducer managing bestsellers state.
  latest: latestReducer, // Reducer managing latest products state.
  products: productsReducer, // Reducer managing general products state.
  cart: cartReducer, // Reducer managing shopping cart state.
  shippingData: shippingDataReducer, // Reducer managing shipping information state.
  savedPayment: savedPaymentReducer, // Reducer managing saved payment methods state.
  checkout: checkoutReducer, // Reducer managing checkout process state.
});

// Persisted reducer created using persistConfig and rootReducer, enabling state persistence.
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Redux store configuration using persistedReducer as the root reducer.
export const store = configureStore({
  reducer: persistedReducer, // Root reducer with persistence.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // Actions to ignore for serialization checks.
      },
    }),
});

// Persistor created to manage state persistence across page reloads or app restarts.
export const persistor = persistStore(store);
