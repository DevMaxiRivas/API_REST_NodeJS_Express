import { header, param } from 'express-validator'
import { SECRET_JWT_KEY } from '../../config.js'
import { validateJWTToken } from '../../lib/validateJWTToken.js'

const deleteUserRequest = [
    header('authorization').exists().withMessage('Authorization header is required'),
    header('authorization').custom((value) => { return validateJWTToken(value.split(' ')[1], SECRET_JWT_KEY, 'headers') }),
    param('id').isInt().withMessage('userId must be an integer')
]

export default deleteUserRequest
