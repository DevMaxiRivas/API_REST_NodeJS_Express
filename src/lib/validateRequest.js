import { validationResult } from 'express-validator'
import { ValidationError } from '../utils/errors.js'

/**
 * Validates the request using `express-validator` validation results.
 *
 * This function checks for validation errors previously registered by `express-validator`
 * middleware (e.g., `body()`, `param()`, `query()` rules). If any validation error exists,
 * it extracts the **first** error from the result array and throws a `ValidationError`
 * with details from that error. If no errors are found, execution continues normally.
 *
 * This is typically used as a final validation step in a route or custom middleware
 * after running the relevant `express-validator` checks.
 *
 * @param {Object} req - The Express request object, which must have been processed by
 *                       `express-validator` middleware (so that `validationResult(req)`
 *                       contains the validation state).
 * @throws {ValidationError} Throws a `ValidationError` when validation fails.
 *                           The error will contain:
 *                           - Message: `'Validation error: ' + validationError.msg`
 *                           - Additional properties: `validationError.msg` and `validationError.location`
 * @returns {void} Returns nothing if validation passes.
 *
 * @example
 * // In an Express route with express-validator rules
 * import { body } from 'express-validator';
 *
 * app.post('/user',
 *   body('email').isEmail(),
 *   body('age').isInt(),
 *   (req, res, next) => {
 *     validateRequest(req); // throws ValidationError if any rule fails
 *     // If we reach here, request is valid
 *     res.status(201).json({ message: 'User created' });
 *   }
 * );
 *
 * @example
 * // Example of a caught validation error
 * try {
 *   validateRequest(mockReqWithError);
 * } catch (err) {
 *   console.error(err.message); // 'Validation error: Invalid email'
 *   console.error(err.msg);     // 'Invalid email'
 *   console.error(err.location); // 'body'
 * }
 */
export function validateRequest(req) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const validationError = errors.array()[0]
        throw new ValidationError(
            'Validation error: ' + validationError.msg,
            validationError.msg,
            validationError.location
        )
    }
}
