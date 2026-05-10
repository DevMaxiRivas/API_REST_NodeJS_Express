import { BadRequestError } from '../utils/errors.js'

export function validateBody(req) {
    if (req.body === undefined) {
        throw new BadRequestError('Bad request', 'No fields in the request', 'body')
    }
}
