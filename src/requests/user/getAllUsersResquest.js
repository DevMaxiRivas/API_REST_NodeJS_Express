import { header } from 'express-validator'
import { SECRET_JWT_KEY } from '../../config.js'
import { validateJWTToken } from '../../lib/validateJWTToken'

const getAllUserRequest = [
    header('authorization').exists().withMessage('Authorization header is required'),
    header('authorization').custom((value) => { return validateJWTToken(value.split(' ')[1], SECRET_JWT_KEY, 'headers') })
]

export default getAllUserRequest
