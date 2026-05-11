import jwt from 'jsonwebtoken'
import { createApiError } from '../utils/errors.js'

/**
 * Validates a JWT token by checking its existence and signature.
 *
 * This function verifies that a token is provided and then uses `jsonwebtoken.verify()`
 * to validate it against a secret key. If the token is missing or invalid (expired,
 * malformed, incorrect signature, etc.), it throws an API error with status 401.
 * On successful verification, it returns `true`.
 *
 * @param {string | null} [token=null] - The JWT token to validate. If falsy, an error is thrown.
 * @param {string} secretKey - The secret key used to verify the token's signature.
 * @param {string} [source='headers'] - The source location of the token (e.g., `'headers'`, `'cookies'`, `'body'`).
 *                                      This is used in the error's `source` property for debugging purposes.
 * @throws {ApiError} Throws an API error with status 401 in two cases:
 *                    - When `token` is falsy → error title: `'Authentication failed. Token not found.'`
 *                    - When `jwt.verify()` fails → error title: `'Authentication failed. Invalid token.'`
 *                    Both errors include the provided `source` in their metadata.
 * @returns {true} Returns `true` if the token is valid and verification succeeds.
 *
 * @example
 * // Validate an access token from headers
 * const token = req.headers.authorization?.split(' ')[1];
 * try {
 *   validateJWTToken(token, SECRET_JWT_KEY, 'authorization header');
 *   // Token is valid, proceed
 * } catch (err) {
 *   // Handle 401 error
 * }
 *
 * @example
 * // Validate a refresh token from cookies
 * const refreshToken = req.cookies.refresh_token;
 * validateJWTToken(refreshToken, SECRET_JWT_REFRESH_KEY, 'cookie');
 *
 * @example
 * // Missing token
 * validateJWTToken(null, 'secret');
 * // Throws ApiError: 401, 'Authentication failed. Token not found.', source: 'headers'
 *
 * @example
 * // Invalid token (expired or tampered)
 * validateJWTToken('eyJhbGciOiJIUzI1NiIs...', 'secret');
 * // Throws ApiError: 401, 'Authentication failed. Invalid token.', source: 'headers'
 */
export function validateJWTToken(token = null, secretKey, source = 'headers') {
    if (!token) throw createApiError(401, 'Unauthorized Error', { title: 'Authentication failed. Token not found.', source: source })
    jwt.verify(token, secretKey)
    return true
}
