import jwt from 'jsonwebtoken'
import { SECRET_JWT_KEY, SECRET_JWT_REFRESH_KEY } from '../config.js'
import { InternalError } from '../utils/errors.js'

/**
 * Generates a JWT token for a user.
 *
 * This function creates a signed JSON Web Token (JWT) using the appropriate secret key
 * based on the token type (`access` or `refresh`). The token payload includes the user's `id`
 * and `username`. An expiration time can be specified; default is 1 hour for both token types.
 *
 * @param {Object} user - The user object for which the token is generated.
 * @param {string|number} user.id - The unique identifier of the user.
 * @param {string} user.username - The username of the user.
 * @param {string} [type='access'] - The type of token to generate. Must be either `'access'` or `'refresh'`.
 * @param {string} [expiresIn='1h'] - Token expiration time (e.g., `'2h'`, `'15m'`, `'7d'`). Default is `'1h'`.
 * @returns {string} A signed JWT string.
 *
 * @throws {InternalError} Throws an `InternalError` when the provided `type` is neither `'access'` nor `'refresh'`.
 *
 * @example
 * // Generate an access token (default)
 * const user = { id: 123, username: 'john_doe' };
 * const accessToken = generateToken(user);
 * // Returns a signed JWT (access type)
 *
 * @example
 * // Generate a refresh token with custom expiration
 * const refreshToken = generateToken(user, 'refresh', '7d');
 * // Returns a signed JWT (refresh type) valid for 7 days
 *
 * @example
 * // Throws an error for invalid type
 * generateToken(user, 'invalid');
 * // Throws: InternalError: GenerateToken: Type not found
 */

export function generateToken(user, type = 'access', expiresIn = '1h') {
    const payload = { id: user.id, username: user.username }
    const options = { expiresIn: expiresIn }
    switch (type) {
        case 'access': {
            return jwt.sign(
                payload,
                SECRET_JWT_KEY,
                options
            )
        }
        case 'refresh': {
            return jwt.sign(
                payload,
                SECRET_JWT_REFRESH_KEY,
                options
            )
        }
        default: {
            throw new InternalError('GenerateToken: Type not found', 'internal error')
        }
    }
}
