import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "./revertAll";

// Check if the authToken exists in local storage
const authTokenLocalStorage = localStorage.getItem("authToken");
// Check if the authToken exists in session storage
const authTokenSessionStorage = sessionStorage.getItem("authToken");

// Initialize the token using local storage, session storage, or set to null
const initialToken = authTokenLocalStorage || authTokenSessionStorage || null;


const userInitialState = {
  user: null,
  isAuthenticated: false,
  token: initialToken,
  error: false,
}

// Redux slice for user authentication
const userAuthSlice = createSlice({
  name: "userAuth",
  initialState: userInitialState,
  reducers: {
    activeAuth: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    getToken: (state, action) => {
      // Update the token based on the success flag in the action payload
      const { success, token } = action.payload;
      success ? (state.token = token) : null;
    },
    setUser: (state, action) => {
      // Update the user based on the success flag in the action payload
      const { user } = action.payload;
      user ? state.user = user : null;
    },
    setStripeCustomerId: (state, action) => {
      // Update the user's stripeCustomerId
      const { stripeCustomerId } = action.payload;
      state.user = { ...state.user, stripeCustomerId: stripeCustomerId };
    },
    setError: (state, action) => {
      // Set the error in the state
      state.error = action.payload;
    },
    removeError: (state) => {
      // Remove the error from the state
      state.error = null;
      state.user = null;
      state.isAuthenticated = false;
      state.token = initialToken;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = initialToken;
    },
  },
  extraReducers: (builder) =>
    builder.addCase(revertAll, () => userInitialState),
});

// Export actions and reducer from the slice
export const { activeAuth, setUser, setStripeCustomerId, setError, logoutUser, removeError, getToken } =
  userAuthSlice.actions;
export default userAuthSlice.reducer;
