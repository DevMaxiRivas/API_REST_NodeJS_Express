import { validationResult } from 'express-validator'
import { getFullUrl } from './getFullUrl.js'
import { ValidationError } from '../utils/errors.js'

export function validateRequest(req) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const validationError = errors.array()[0]

        throw new ValidationError(
            'Validation error: ' + validationError.msg,
            validationError.msg,
            validationError.location,
            getFullUrl(req)
        )
    }
}
