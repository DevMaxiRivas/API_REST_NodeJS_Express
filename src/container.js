import pool from './config/database.js'

import UserRepository from './repositories/userRepository.js'
import UserService from './services/userService.js'
import UserController from './controllers/userController.js'

// 1. Infraestructura
const userRepository = new UserRepository(pool)

// 2. Servicios (reciben repositories)
const userService = new UserService(userRepository)

// 3. Controllers (reciben services)
const userController = new UserController(userService)

export default userController
