import axios from "axios";
import apiBaseUrl from "../config/apiConfig";
import { useQuery } from "react-query";

// Function to fetch search products based on query
export const fetchSearchProducts = async (query) => {
  try {
    // Make a GET request to fetch search products using the provided query
    const response = await axios.get(
      `${apiBaseUrl}products/search?query=${query}`,
    );

    // Check if the response status is 404
    if (response.status === 404) {
      throw new Error(response.data.message); // Throw an error with the message from the response
    }

    return response.data; // Return the data from the response
  } catch (error) {
    // Handle other errors
    throw new Error(error.message); // Throw an error with the error message
  }
};

// Custom hook to use the search products data with react-query
export const useSearchProducts = (query) => {
  return useQuery(
    ["searchProducts", query], // Unique key for the query cache
    async () => {
      const data = await fetchSearchProducts(query); // Call fetchSearchProducts function with the provided query
      return data; // Return the fetched data
    },
    {
      retry: 3, // Number of retry attempts in case of failure
      onError: (error) => {
        // Error handling here
        console.error("Error fetching search products:", error); // Log error fetching search products
      },
    },
  );
};
