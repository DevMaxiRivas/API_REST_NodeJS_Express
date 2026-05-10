import jwt from 'jsonwebtoken'
import { JWT_ACCESS_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN, SECRET_JWT_KEY, SECRET_JWT_REFRESH_KEY } from '../config.js'
import { InternalError } from '../utils/errors.js'

/**
 * Generates a JWT token for a user.
 *
 * This function creates a signed JSON Web Token (JWT) using the appropriate secret key
 * based on the token type (`access` or `refresh`). The token payload includes the user's `id`
 * and `username`.
 *
 * @param {Object} user - The user object for which the token is generated.
 * @param {string|number} user.id - The unique identifier of the user.
 * @param {string} user.username - The username of the user.
 * @param {string} [type='access'] - The type of token to generate. Must be either `'access'` or `'refresh'`.
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
 * const refreshToken = generateToken(user, 'refresh');
 * // Returns a signed JWT (refresh type) valid for JWT_REFRESH_EXPIRES_IN days
 *
 * @example
 * // Throws an error for invalid type
 * generateToken(user, 'invalid');
 * // Throws: InternalError: GenerateToken: Type not found
 */

export function generateToken(user, type = 'access') {
    const payload = { id: user.id, username: user.username }
    switch (type) {
        case 'access': {
            return jwt.sign(
                payload,
                SECRET_JWT_KEY,
                { expiresIn: JWT_ACCESS_EXPIRES_IN }
            )
        }
        case 'refresh': {
            return jwt.sign(
                payload,
                SECRET_JWT_REFRESH_KEY,
                { expiresIn: JWT_REFRESH_EXPIRES_IN }
            )
        }
        default: {
            throw new InternalError('GenerateToken: Type not found', 'internal error')
        }
    }
}
