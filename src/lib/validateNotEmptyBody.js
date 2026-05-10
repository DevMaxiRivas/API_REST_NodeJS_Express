import { BadRequestError } from '../utils/errors.js'

/**
 * Validates that the request object contains a non‑undefined body.
 *
 * This function checks whether `req.body` is `undefined`. If so, it throws a
 * `BadRequestError` indicating that the request lacks any fields in the body.
 * It is typically used in middleware or route handlers to ensure that incoming
 * requests with required body data (e.g., POST, PUT, PATCH) are properly formed.
 *
 * @param {Object} req - The Express request object.
 * @param {any} req.body - The body of the request. Expected to be defined (e.g., parsed JSON or form data).
 * @throws {BadRequestError} Throws a `BadRequestError` when `req.body` is `undefined`,
 *                           with message `'Bad request'`, detail `'No fields in the request'`,
 *                           and location `'body'`.
 * @returns {void} This function does not return a value. If validation passes, execution continues normally.
 *
 * @example
 * // Valid usage inside an Express route handler
 * app.post('/user', (req, res, next) => {
 *   validateNotEmptyBody(req); // passes if req.body exists
 *   // ... process the request
 * });
 *
 * @example
 * // When req.body is undefined, an error is thrown
 * try {
 *   validateNotEmptyBody({ body: undefined });
 * } catch (err) {
 *   console.error(err); // BadRequestError: Bad request
 * }
 */
export function validateNotEmptyBody(req) {
    if (Object.keys(req.body).length === 0) {
        throw new BadRequestError('Bad request', 'No fields in the request', 'body')
    }
    return true
}
