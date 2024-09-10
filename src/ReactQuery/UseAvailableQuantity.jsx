import axios from "axios";
import apiBaseUrl from "../config/apiConfig";
import { useQuery } from "react-query";

// Function to fetch available quantity from the backend API
const fetchAvailableQuantity = async (productId) => {
  try {
    // Make a GET request to fetch available quantity for a specific product
    const response = await axios.get(
      `${apiBaseUrl}products/availableQuantity/${productId}`
    );
    
    // Extract availableQuantity from the response data
    const { availableQuantity } = response.data;
    
    return availableQuantity; // Return the available quantity
  } catch (error) {
    console.error("Error fetching available quantity:", error);
    throw new Error("Failed to fetch available quantity"); // Throw an Error object with a message on failure
  }
};

// Custom hook to retrieve the available quantity of a product
export const useAvailableQuantity = (productId) => {
  return useQuery(
    ["availableQuantity", productId], // Unique key for the query cache
    async () => {
      try {
        const availableQuantity = await fetchAvailableQuantity(productId); // Fetch available quantity using productId
        
        return availableQuantity; // Return the fetched available quantity
      } catch (error) {
        console.error("Error in useAvailableQuantity hook:", error);
        return 0; // Return 0 in case of error to handle gracefully
      }
    },
    {
      enabled: !!productId, // Enable the query only when productId is defined
      retry: false, // Disable automatic retry of the query on error
    }
  );
};
