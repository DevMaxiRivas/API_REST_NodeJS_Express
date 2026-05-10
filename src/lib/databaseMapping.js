/**
 * Converts a JavaScript array into a PostgreSQL-compatible array string.
 *
 * PostgreSQL array literals use curly braces `{}` instead of square brackets `[]`.
 * This function transforms a standard array by replacing the outer brackets
 * and returns the resulting string. If the input is falsy (`null`, `undefined`, etc.),
 * an empty string is returned.
 *
 * @param {any[]} array - The array to be converted. Falsy values result in an empty string.
 * @returns {string} A string representing the array in PostgreSQL format, e.g., `"{1,2,3}"`.
 *                   Returns `''` if the input is falsy.
 *
 * @example
 * // Convert a simple array
 * arrayToString([1, 2, 3]);
 * // Returns: "{1,2,3}"
 *
 * @example
 * // Convert an array of strings
 * arrayToString(["a", "b", "c"]);
 * // Returns: '{"a","b","c"}'
 *
 * @example
 * // Handle null/undefined input
 * arrayToString(null);
 * // Returns: ''
 */
export function arrayToString(array) {
    if (!array) {
        return ''
    }

    const json = JSON.stringify(array)
    return json.replace('[', '{').replace(']', '}')
}
