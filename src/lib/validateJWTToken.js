import jwt from 'jsonwebtoken'
import { createApiError } from '../utils/errors'

export function validateJWTToken(token = null, secretKey, source = 'headers') {
    if (!token) throw createApiError(401, 'Unauthorized Error', { title: 'Authentication failed. Token not found.', source: source })

    try {
        jwt.verify(token, secretKey)
        return true
    } catch (err) {
        throw createApiError(401, 'Unauthorized Error', { title: 'Authentication failed. Invalid token.', source: source })
    }
}
