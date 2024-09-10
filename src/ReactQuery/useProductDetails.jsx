import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import apiBaseUrl from "../config/apiConfig";

// Function to fetch product details by ID
export const fetchProductsDetails = async (id) => {
  try {
    // Make a GET request to fetch product details using the provided ID
    const response = await axios.get(`${apiBaseUrl}products/${id}`);
    return response.data; // Return the data from the response
  } catch (error) {
    // If an error occurs during the request, throw an Error object with the error message
    throw new Error(error.message);
  }
};

// Custom hook to use the product details data with react-query
export const useProductsDetails = (id) => {
  return useQuery(
    ["productDetails", id], // Unique key for the query cache
    async () => {
      try {
        const data = await fetchProductsDetails(id); // Call fetchProductsDetails function with the provided ID
        return data; // Return the fetched data
      } catch (error) {
        // Handle the error if necessary
        throw new Error(error.message); // Throw an Error object with the error message
      }
    }
  );
};
