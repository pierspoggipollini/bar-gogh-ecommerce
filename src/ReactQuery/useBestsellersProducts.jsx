import axios from "axios"
import apiBaseUrl from "../config/apiConfig"
import { useQuery } from "react-query";
import { isCacheExpired } from "./isCacheExpired";

// Function to fetch bestseller products from the API
const fetchBestsellers = async () => {
  try {
    // Make a GET request to fetch bestseller products with a limit of 4
    const response = await axios.get(`${apiBaseUrl}products/bestsellers?limit=4`);
    return response.data; // Return the data from the response
  } catch (error) {
    throw new Error(error.message); // Throw an Error object with the error message if request fails
  }
};

// Custom hook to use the bestseller products data with react-query
export const useBestsellersProducts = () => {
  return useQuery(
    ["bestsellers"], // Unique key for the query cache
    async () => {
      const cachedData = JSON.parse(localStorage.getItem("bestsellers"));

      // Decide whether to fetch from API based on cached data expiration or absence
      const shouldFetchFromAPI = !cachedData || isCacheExpired(cachedData);

      if (shouldFetchFromAPI) {
        try {
          // Fetch bestseller products data from the API
          const apiData = await fetchBestsellers();

          // Store fetched data in localStorage with timestamp for caching
          localStorage.setItem(
            "bestsellers",
            JSON.stringify({ data: apiData, timestamp: Date.now() }),
          );

          return apiData; // Return the fetched data
        } catch (error) {
          throw new Error(error.message); // Throw an Error object with the error message if fetching fails
        }
      } else {
        // Use data from the cache if it's valid and not expired
        return cachedData.data || cachedData;
      }
    }
  );
};
