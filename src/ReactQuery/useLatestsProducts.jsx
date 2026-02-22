import axios from "axios";
import apiBaseUrl from "../config/apiConfig";
import { useQuery } from "@tanstack/react-query";
import { isCacheExpired } from "./isCacheExpired";

// Function to fetch latest products from the API
const fetchLatests = async () => {
  try {
    // Make a GET request to fetch latest products with a limit of 4
    const response = await axios.get(`${apiBaseUrl}products/latests?limit=4`);
    return response.data; // Return the data from the response
  } catch (error) {
    throw new Error(error.message); // Throw an Error object with the error message if request fails
  }
};

// Custom hook to use the latest products data with react-query
export const useLatestProducts = () => {
  return useQuery({
    queryKey: ["latests"],
    queryFn: async () => {
      const cachedData = JSON.parse(localStorage.getItem("latests"));

      // Decide whether to fetch from API based on cached data expiration or absence
      const shouldFetchFromAPI = !cachedData || isCacheExpired(cachedData);

      if (shouldFetchFromAPI) {
        try {
          // Fetch latest products data from the API
          const apiData = await fetchLatests();

          // Store fetched data in localStorage with timestamp for caching
          localStorage.setItem(
            "latests",
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
    },
  });
};