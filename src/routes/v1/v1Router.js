// import { Router } from 'express'
import createUserRoutes from './userRoutes.js'
import { userController, authController } from '../../container.js'
import { Router } from 'express'
import { validateRequest } from '../../lib/validateRequest.js'
import { UnauthorizedError } from '../../utils/errors.js'
import updateUserRequest from '../../requests/user/updateUserRequest.js'
import { validateBody } from '../../lib/validateBody.js'
import createAuthRoutes from './authRoutes.js'

const createV1Routes = Router()

createV1Routes.use('/users', createUserRoutes(userController))
createV1Routes.use('/auth', createAuthRoutes(authController))

createV1Routes.patch('/me', updateUserRequest, (req, res, next) => {
    if (!req.session.user) {
        throw new UnauthorizedError('Unauthorized Error', 'No token in the request', 'header')
    }

    validateBody(req)
    validateRequest(req)
    try {
        userController.updateAuthUser(req, res, next)
    } catch (err) {
        next(err)
    }
})

createV1Routes.get('/health', (req, res) => res.status(200).send({ message: 'OK' }))

export default createV1Routes

