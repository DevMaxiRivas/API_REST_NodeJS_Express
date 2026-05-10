import { cookie } from 'express-validator'
import { validateJWTToken } from '../../lib/validateJWTToken.js'
import { SECRET_JWT_REFRESH_KEY } from '../../config.js'

const logoutRequest = [
    cookie('refresh_token').exists().withMessage('refresh_token cookie is required'),
    cookie('refresh_token').custom((value, { req }) => { return validateJWTToken(value, SECRET_JWT_REFRESH_KEY, 'cookie') })
]

export default logoutRequest
