/**
 * Function to deeply compare two objects for equality.
 * @param {Object} obj1 - The first object to compare.
 * @param {Object} obj2 - The second object to compare.
 * @returns {boolean} True if the objects are deeply equal, otherwise false.
 */
export function deepEqual(obj1, obj2) {
    // If both objects are null or undefined, they are equal
    if (obj1 === obj2) return true;

    // If one of the objects is null or undefined, they are not equal
    if (obj1 == null || obj2 == null) return false;

    // Check if both objects are objects
    if (typeof obj1 !== "object" || typeof obj2 !== "object") return false;

    // Get the keys of the objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // If the number of keys is different, the objects are not equal
    if (keys1.length !== keys2.length) return false;

    // Check if all keys of obj1 exist in obj2 and have the same value
    for (let key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    // If all checks pass, the objects are equal
    return true;
}
