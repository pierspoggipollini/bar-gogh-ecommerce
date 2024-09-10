import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import * as userAuthActions from "../store/user-auth";
import axiosInstance from "../config/axiosInstance";

// Function to fetch user profile data
/* export const fetchUserProfile = async () => {
  try {
    // Make a GET request to fetch user profile data from the API
    const response = await axios.get(`${apiBaseUrl}profile`);
    const user = response.data.user; // Extract user data from response
    return user; // Return user data
  } catch (error) {
    // Throw an error if there's any problem during the request
    throw new Error(error.message);
  }
}; */

// Function to fetch Stripe customer ID
export const fetchStripeCustomerId = async () => {
  try {
    // Make a GET request to fetch Stripe customer ID from the API
    const response = await axiosInstance.get(`get-customer-id`);
    const stripeCustomerId = response.data; // Extract Stripe customer ID from response
    return stripeCustomerId; // Return Stripe customer ID
  } catch (error) {
    // Throw an error if there's any problem during the request
    throw new Error(error.message);
  }
};

// Custom hook to conditionally fetch user data based on authentication status
export const useConditionalUserData = (isAuthenticated) => {
  const dispatch = useDispatch(); // Initialize useDispatch hook to dispatch actions

  return useQuery(
    ["userData"], // Unique key for the query cache
    async () => {
      if (isAuthenticated) {
        // If user is authenticated, fetch user profile data
        const jwtToken = localStorage.getItem("session_JWT_Token");

        // Assicurati che il token JWT sia valido
        if (!jwtToken) {
          console.error("No JWT token found in localStorage");
          // Gestisci il caso in cui il token non sia presente (opzionale)
          throw new Error("No JWT token found");
        }

        if (!jwtToken) {
          throw new Error("No session token found");
        }

        const response = await axiosInstance.get("profile");
        dispatch(userAuthActions.setError(false)); // Reset error state
        const userData = response.data.user; // Extract user data from response
        return userData; // Return user data
      } else {
        // If user is not authenticated, return null or empty value as per your choice
        return null;
      }
    },
    {
      enabled: isAuthenticated, // Enable/disable the query based on isAuthenticated flag
      // Other configuration options can be added as per your needs
      onSuccess: (data) => {
        if (data) {
          dispatch(userAuthActions.setError(false)); // Reset error state
          dispatch(userAuthActions.setUser({ user: data })); // Set user data in Redux store
        }
      },
      onError: (error) => {
        dispatch(userAuthActions.setError(true)); // Set error state if there's an error
      },
    },
  );
};
