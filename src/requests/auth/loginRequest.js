import { body, header } from 'express-validator'
import { validateNotEmptyBody } from '../../lib/validateNotEmptyBody'

const loginRequest = [
    header('authorization').not().exists().withMessage('Authorization header should not exist'),
    body().custom((value, { req }) => { return validateNotEmptyBody(req) }),
    body('username').isString().withMessage('username is required and must be a string'),
    body('password').isString().withMessage('password is required and must be a string')
]

export default loginRequest
