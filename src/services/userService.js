import { NotFoundError, ValidationError } from '../utils/errors.js'
import UserModel from '../models/userModel.js'
import userUpdateDTO from '../dtos/userUpdateDTO.js'

export default class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository
    }

    async getAll() {
        return this.userRepository.findAll()
    }

    async getById(id) {
        const user = await this.userRepository.findById(id)
        if (!user) {
            throw new NotFoundError('Not found User', 'id')
        }
        return user
    }

    async create(data) {
        const existEmail = await this.userRepository.existsEmail(data.email)
        const existUsername = await this.userRepository.existsUsername(data.username)

        if (existEmail) {
            throw new ValidationError('Validation Error', 'This email address has already been registered', 'body.email')
        }

        if (existUsername) {
            throw new ValidationError('Validation Error', 'This username has already been registered', 'body.username')
        }

        return await this.userRepository.create(data)
    }

    async update(id, data) {

        const user = await this.userRepository.findById(id)
        if (!user) {
            throw new NotFoundError('Not found User', 'id')
        }

        const keys = Object.keys(data)
        if (keys.includes('email')) {
            const existEmail = await this.userRepository.existsEmail(data.email)

            if (existEmail) {
                throw new ValidationError('Validation Error', 'This email address has already been registered', 'body.email')
            }
        }

        if (keys.includes('username')) {
            const existUsername = await this.userRepository.existsUsername(data.username)
            if (existUsername) {
                throw new ValidationError('Validation Error', 'This username has already been registered', 'body.username')
            }
        }

        return await this.userRepository.update(id, data)
    }

    async delete(id) {

        const user = await this.userRepository.findById(id)
        if (!user) {
            throw new NotFoundError('Not found User', 'id')
        }

        return await this.userRepository.delete(id)
    }
}