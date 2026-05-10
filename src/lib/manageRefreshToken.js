/**
 * Adds a token to a list of tokens.
 *
 * If the input list is falsy (e.g., `null` or `undefined`), a new array containing only the token is returned.
 * Otherwise, the token is pushed into the existing array (mutating it) and the same array reference is returned.
 *
 * @param {Array<string> | null | undefined} tokens - The existing list of tokens. Can be falsy.
 * @param {string} token - The token to add.
 * @returns {Array<string>} The updated list of tokens (either the original mutated array or a new array).
 *
 * @example
 * // Adding to an existing array (mutates)
 * const myTokens = ['abc123'];
 * const result = addTokenToList(myTokens, 'xyz789');
 * console.log(result); // ['abc123', 'xyz789']
 * console.log(myTokens === result); // true (same array)
 *
 * @example
 * // Starting with null
 * const newList = addTokenToList(null, 'new-token');
 * console.log(newList); // ['new-token']
 */
export function addTokenToList(tokens, token) {
    if (!tokens) {
        return [token]
    }

    tokens.push(token)
    return tokens
}

/**
 * Removes a token from a list of tokens.
 *
 * If the input list is falsy (e.g., `null` or `undefined`), an empty array is returned.
 * Otherwise, a **new** array is returned containing all tokens except the one that matches
 * the provided token (strict equality `!==`). The original array is not mutated.
 *
 * @param {Array<string> | null | undefined} tokens - The existing list of tokens. Can be falsy.
 * @param {string} token - The token to remove.
 * @returns {Array<string>} A new array without the specified token, or an empty array if input was falsy.
 *
 * @example
 * // Removing a token from an existing array (non-mutating)
 * const myTokens = ['abc123', 'xyz789', 'foo'];
 * const result = removeTokenFromList(myTokens, 'xyz789');
 * console.log(result); // ['abc123', 'foo']
 * console.log(myTokens); // ['abc123', 'xyz789', 'foo'] (unchanged)
 *
 * @example
 * // When input is null
 * const result = removeTokenFromList(null, 'anything');
 * console.log(result); // []
 */
export function removeTokenFromList(tokens, token) {
    if (!tokens) {
        return []
    }

    return tokens.filter(t => t !== token)
}
