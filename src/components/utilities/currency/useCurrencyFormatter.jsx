

import { useSelector } from "react-redux";
import { getCurrencyFromCountry } from "./getCurrencyFromCountry";

// Custom hook to format amounts based on the currency from the country
const useCurrencyFormatter = () => {
  // Get the country from the Redux store
  const country = useSelector((state) => state.shippingData.country);

  // Get the currency based on the country
  const currency = getCurrencyFromCountry(country);

  // Define locale and options for number formatting
  const locale = "de-DE"; // You can change this value dynamically
  const options = {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  };

  // Initialize NumberFormat with locale and options
  const formatter = new Intl.NumberFormat(locale, options);

  // Function to format amount using the formatter
  const formatAmount = (amount) => formatter.format(amount);

  // Return the formatAmount function
  return formatAmount;
};

export default useCurrencyFormatter; // Export the custom hook

