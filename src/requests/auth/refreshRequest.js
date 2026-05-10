import { cookie } from 'express-validator'
import { validateJWTToken } from '../../lib/validateJWTToken'
import { SECRET_JWT_REFRESH_KEY } from '../../config'

const refreshRequest = [
    cookie('refresh_token').exists().withMessage('refresh_token cookie is required'),
    cookie('refresh_token').custom((value, { req }) => { return validateJWTToken(value, SECRET_JWT_REFRESH_KEY, 'cookie') })
]

export default refreshRequest
