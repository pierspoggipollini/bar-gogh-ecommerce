
// Function to get the currency based on the country
export const getCurrencyFromCountry = (country) => {
  // Map of country codes to currency codes
  const countryCurrencyMap = {
    DE: "EUR", // Germany uses Euro
    IT: "EUR", // Italy uses Euro
    US: "USD", // United States uses US Dollar
    // Add more country-currency associations if needed
  };

  // Return the currency code for the given country, or default to EUR if not mapped
  return countryCurrencyMap[country] || "EUR";
};
