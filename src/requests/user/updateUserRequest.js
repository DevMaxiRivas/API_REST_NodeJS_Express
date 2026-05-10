import { body, param } from 'express-validator'
import { validateNotEmptyBody } from '../../lib/validateNotEmptyBody'

const updateUserRequest = [
    param('id').isInt().withMessage('userId must be an integer'),
    body().custom((value, { req }) => { return validateNotEmptyBody(req) }),
    body('name').optional().isString().withMessage('Name must be a string'),
    body('username').optional().isString().withMessage('Username must be a string'),
    body('email').optional().isEmail().withMessage('The Email most be a email')
]

export default updateUserRequest
