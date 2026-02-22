import axios from "axios";
import React from "react";
import { useQuery } from "@tanstack/react-query";
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
  return useQuery({
    queryKey: ["productDetails", id],
    queryFn: async () => {
      try {
        const data = await fetchProductsDetails(id);
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });
};
