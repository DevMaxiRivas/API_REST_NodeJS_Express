// import { Router } from 'express'
import createUserRoutes from './userRoutes.js'
import { userController, authController } from '../../container.js'
import { Router } from 'express'
import { validateRequest } from '../../lib/validateRequest.js'
import createAuthRoutes from './authRoutes.js'
import updateMeRequest from '../../requests/me/updateMeRequest.js'

const createV1Routes = Router()

createV1Routes.use('/users', createUserRoutes(userController))
createV1Routes.use('/auth', createAuthRoutes(authController))

createV1Routes.patch('/me', updateMeRequest, (req, res, next) => {
    try {
        validateRequest(req)
        userController.updateAuthUser(req, res, next)
    } catch (err) {
        next(err)
    }
})

createV1Routes.get('/health', (req, res) => res.status(200).send({ message: 'OK' }))

export default createV1Routes

