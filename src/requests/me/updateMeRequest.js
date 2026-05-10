import { body, header } from 'express-validator'
import { validateNotEmptyBody } from '../../lib/validateNotEmptyBody'
import { validateJWTToken } from '../../lib/validateJWTToken'
import { SECRET_JWT_ACCESS_KEY } from '../../config'

const updateMeRequest = [
    header('authorization').exists().withMessage('Authorization header is required'),
    header('authorization').custom((value) => { return validateJWTToken(value.split(' ')[1], SECRET_JWT_ACCESS_KEY, 'headers') }),
    body().custom((value, { req }) => { return validateNotEmptyBody(req) }),
    body('name').optional().isString().withMessage('Name must be a string'),
    body('username').optional().isString().withMessage('Username must be a string'),
    body('email').optional().isEmail().withMessage('The Email most be a email')
]

export default updateMeRequest
