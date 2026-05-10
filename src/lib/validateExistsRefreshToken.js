import { createApiError } from '../utils/errors.js'

export function validateExistsRefreshToken(req) {
    if (!req.cookies.refresh_token) {
        throw createApiError(401, 'Unauthorized Error', { title: 'Authentication failed. Token not found.', source: 'cookie' })
    }
}
