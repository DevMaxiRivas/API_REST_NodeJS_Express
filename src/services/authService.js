import { NotFoundError, UnauthorizedError, ValidationError } from '../utils/errors.js'
import UserModel from '../models/userModel.js'
import userUpdateDTO from '../dtos/userUpdateDTO.js'

import bcrypt from 'bcrypt';

export default class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository
    }

    async login(username, password) {
        const user = await this.userRepository.findByUsername(username)
        if (!user) {
            throw new UnauthorizedError('Unauthorized Error', 'Authentication failed. User not found.', 'body.username')
        }

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
            throw new UnauthorizedError('Unauthorized Error', 'Authentication failed. Wrong password.', 'body.password')
        }

        return user
    }
}