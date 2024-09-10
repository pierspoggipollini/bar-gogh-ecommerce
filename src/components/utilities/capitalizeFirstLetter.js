/**
 * Function to capitalize the first letter of a string and convert the rest to lowercase.
 * @param {string} str - The input string.
 * @returns {string} The string with the first letter capitalized and the rest converted to lowercase.
 */
export function capitalizeFirstLetter(str) {
    // Capitalize the first letter using charAt(0) and toUpperCase()
    // Concatenate it with the rest of the string converted to lowercase using slice(1) and toLowerCase()
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
