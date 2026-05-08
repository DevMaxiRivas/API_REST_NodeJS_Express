import { body } from 'express-validator'

const createUserRequest = [
    body('name').isString().withMessage('name is required and must be a string'),
    body('email').isEmail().withMessage('email is required and most be a email'),
    body('password').isString().withMessage('password is required and must be a string'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 chars long')
]

export default createUserRequest
