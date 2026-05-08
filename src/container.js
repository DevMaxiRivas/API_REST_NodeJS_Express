import pool from './config/database.js'

import UserRepository from './repositories/userRepository.js'
import UserService from './services/userService.js'
import UserController from './controllers/userController.js'
import AuthController from './controllers/authController.js'
import AuthService from './services/authService.js'

const userRepository = new UserRepository(pool)

const userService = new UserService(userRepository)

const authService = new AuthService(userRepository)

const userController = new UserController(userService)

const authController = new AuthController(authService)

export { userController, authController }
