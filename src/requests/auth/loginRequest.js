import { body } from 'express-validator'

const loginRequest = [
    body('username').isString().withMessage('username is required and must be a string'),
    body('password').isString().withMessage('password is required and must be a string')
]

export default loginRequest
