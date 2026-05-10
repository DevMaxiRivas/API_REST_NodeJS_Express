import { createApiError } from '../utils/errors.js'

export function validateWithoutSession(req) {
    if (req.session.user) {
        throw createApiError(
            400,
            'AuthRoutes - /login: User already logged in',
            { detail: 'User already logged in', source: 'header' }
        )
    }
}
