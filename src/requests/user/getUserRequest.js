import { param } from 'express-validator'

const getUserRequest = [
    param('id').isInt().withMessage('userId must be an integer')
]

export default getUserRequest
