import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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

  const query = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const jwtToken = localStorage.getItem("session_JWT_Token");

      if (!jwtToken) {
        console.error("No JWT token found in localStorage");
        throw new Error("No JWT token found");
      }

      const response = await axiosInstance.get("profile");
      dispatch(userAuthActions.setError(false));
      const userData = response.data.user;
      return userData;
    },
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (query.data) {
      dispatch(userAuthActions.setError(false));
      dispatch(userAuthActions.setUser({ user: query.data }));
    }
  }, [query.data, dispatch]);

  useEffect(() => {
    if (query.error) {
      dispatch(userAuthActions.setError(true));
    }
  }, [query.error, dispatch]);

  return query;
};
