// Function to compare two date strings and return the difference in milliseconds
export const compareDates = (dateStrA, dateStrB) => {
    // Convert date strings to Date objects
    const dateA = new Date(dateStrA.split("/").reverse().join("-"));
    const dateB = new Date(dateStrB.split("/").reverse().join("-"));

    // Calculate the difference in milliseconds
    // The result will be positive if dateB is greater, negative if dateA is greater
    return dateB - dateA;
};
