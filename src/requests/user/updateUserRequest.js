import { body } from 'express-validator'

const updateUserRequest = [
    body('name').optional().isString().withMessage('Name must be a string'),
    body('username').optional().isString().withMessage('Username must be a string'),
    body('email').optional().isEmail().withMessage('The Email most be a email')
]

export default updateUserRequest
