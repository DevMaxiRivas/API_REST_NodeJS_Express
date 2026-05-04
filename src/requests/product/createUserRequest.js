import { body } from 'express-validator'

const createUserRequest = [
    body('name').isString().withMessage('name must be a string'),
    body('email').isEmail().withMessage('email most be a email'),
    body('password').isString().withMessage('password must be a string')
]

export default createUserRequest
