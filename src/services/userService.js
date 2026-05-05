import { NotFoundError, ValidationError } from '../errors.js'
import UserModel from '../models/userModel.js'

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
            throw NotFoundError('Not found User', 'id')
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
            console.log(existUsername ? 'true' : 'false')

            throw new ValidationError('Validation Error', 'This username has already been registered', 'body.username')
        }

        return await this.userRepository.create(data)
    }
}