import bcrypt from 'bcrypt'

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
export async function removeTokenFromList(tokens, token) {
    if (!tokens) {
        return []
    }

    let i = 0
    for (i = 0; i < tokens.length; i++) {
        const isEqual = await bcrypt.compare(token, tokens[i])
        if (isEqual) {
            break
        }
    }

    return tokens.filter((_, index) => index !== i)
}


/**
 * Checks if a given token exists in a list of hashed tokens using bcrypt comparison.
 *
 * This function iterates over an array of hashed tokens (presumably stored in a database
 * or in-memory list) and compares each one asynchronously with the provided plain-text token.
 * It returns `true` as soon as a match is found. If none match, it returns `false`.
 *
 * @param {Array<string>} tokens - An array of hashed tokens (e.g., refresh tokens stored as bcrypt hashes).
 * @param {string} token - The plain-text token to compare against the hashed list.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the token matches any hashed token,
 *                             otherwise `false`.
 *
 * @example
 * // Assuming we have stored refresh tokens as bcrypt hashes
 * const hashedTokens = ['$2b$10$...', '$2b$10$...'];
 * const plainToken = req.cookies.refresh_token;
 *
 * const exists = await tokenExistsInList(hashedTokens, plainToken);
 * if (exists) {
 *   // Token is valid and known
 * }
 */
export async function tokenExistsInList(tokens, token) {
    for (const element of tokens) {
        const isValid = await bcrypt.compare(token, element)
        if (isValid) {
            return true
        }
    }
    return false
}