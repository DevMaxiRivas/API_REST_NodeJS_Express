import { Router } from 'express'
import authController from '../../controllers/authController.js'

const createAuthRoutes = (userController) => {
    const router = Router()

    router.post('/login', authController.login)
    router.post('/logout', authController.logout)

    return router
}

export default createAuthRoutes
