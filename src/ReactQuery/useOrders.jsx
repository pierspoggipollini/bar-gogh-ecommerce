import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../config/axiosInstance";

// Function to fetch orders data from the API
const fetchOrdersData = async () => {
  try {
    // Make a GET request to fetch orders data from the API
    const response = await axiosInstance.get(`dashboard/my-orders`);
    const { success, orders } = response.data;

    // Check if the request was successful
    if (!success) {
      throw new Error("Failed to fetch orders");
    }

    // Return the orders array if successful
    return orders;
  } catch (error) {
    // Log and rethrow any errors that occur during the fetch operation
    console.log("Error fetching orders info:", error.message);
    throw new Error(error.message);
  }
};

// Custom hook to use the orders data with react-query
export const useOrders = () => {
  // Use react-query's useQuery hook to fetch and manage orders data
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      try {
        // Fetch orders data using the fetchOrdersData function
        const orders = await fetchOrdersData();

        // Format dates and sort orders by createdAt date in descending order
        const formattedDates = orders.map((order) => {
          const createdAt = new Date(order.createdAt);
          return { order, createdAt };
        });

        // Sort formatted orders by createdAt date in descending order
        const sortedOrders = formattedDates.sort(
          (a, b) => b.createdAt - a.createdAt,
        );

        // Extract the order objects after sorting
        const sortedOrderData = sortedOrders.map(
          (formattedOrder) => formattedOrder.order,
        );

        // Return the sorted order data
        return sortedOrderData;
      } catch (error) {
        // Handle any errors that occur during data fetching or processing
        throw new Error(error.message);
      }
    },
    retry: 2,
  });
};
