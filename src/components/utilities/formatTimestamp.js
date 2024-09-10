/**
 * Function to format a timestamp into a human-readable date string.
 * @param {number} timestamp - The timestamp to format.
 * @returns {string} The formatted date string.
 */
export function formatTimestamp(timestamp) {
    // Handle the case where the timestamp is not defined or valid
    if (!timestamp) {
        return "";
    }

    // Convert the timestamp to a Date object
    const date = new Date(timestamp * 1000);

    // Format the date using options in the call to toLocaleDateString
    const formattedDate = date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    return formattedDate;
}
