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
            const error = new Error('Usuario no encontrado')
            error.status = 404
            throw error
        }
        return user
    }

    async create(data) {
        UserModel.validate(data) // validación/reglas de negocio acá
        const existing = await this.userRepository.findByEmail(data.email)
        if (existing) {
            const error = new Error('El email ya está registrado')
            error.status = 409
            throw error
        }
        return this.userRepository.create(data)
    }
}