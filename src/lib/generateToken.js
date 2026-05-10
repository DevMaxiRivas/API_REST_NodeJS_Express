import jwt from 'jsonwebtoken'
import { SECRET_JWT_KEY, SECRET_JWT_REFRESH_KEY } from '../config.js'
import { InternalError } from '../utils/errors.js'

export function generateToken(user, type = 'access', expiresIn = '1h') {
    const payload = { id: user.id, username: user.username }
    const options = { expiresIn: expiresIn }
    switch (type) {
        case 'access': {
            return jwt.sign(
                payload,
                SECRET_JWT_KEY,
                options
            )
        }
        case 'refresh': {
            return jwt.sign(
                payload,
                SECRET_JWT_REFRESH_KEY,
                options
            )
        }
        default: {
            throw new InternalError('GenerateToken: Type not found', 'internal error')
        }
    }
}
