import { body, header, param } from 'express-validator'
import { validateNotEmptyBody } from '../../lib/validateNotEmptyBody.js'
import { SECRET_JWT_KEY } from '../../config.js'
import { validateJWTToken } from '../../lib/validateJWTToken.js'

const updateUserRequest = [
    header('authorization').exists().withMessage('Authorization header is required'),
    header('authorization').custom((value) => { return validateJWTToken(value.split(' ')[1], SECRET_JWT_KEY, 'headers') }),
    param('id').isInt().withMessage('userId must be an integer'),
    body().custom((value, { req }) => { return validateNotEmptyBody(req) }),
    body('name').optional().isString().withMessage('Name must be a string'),
    body('username').optional().isString().withMessage('Username must be a string'),
    body('email').optional().isEmail().withMessage('The Email most be a email')
]

export default updateUserRequest
