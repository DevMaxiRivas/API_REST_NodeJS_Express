// import { Router } from 'express'
import createUserRoutes from './userRoutes.js'
import createUserRequest from '../../requests/user/createUserRequest.js'
import { userController, authController } from '../../container.js'
import { Router } from 'express'
import { validateRequest } from '../../lib/validateRequest.js'
import loginRequest from '../../requests/auth/loginRequest.js'
import { BadRequestError } from '../../utils/errors.js'

const createV1Routes = Router()

createV1Routes.use('/users', createUserRoutes(userController))

createV1Routes.post('/login', loginRequest, (req, res, next) => {
    if (req.body === undefined) {
        throw new BadRequestError('Bad request', 'No fields in the request', 'body')
    }

    validateRequest(req)
    try {
        authController.login(req, res, next)
    } catch (err) {
        next(err)
    }
})

createV1Routes.post('/register', createUserRequest, (req, res, next) => {
    validateRequest(req)
    try {
        userController.create(req, res, next)
    } catch (err) {
        next(err)
    }
})
//     // app.post('/logout', (req, res) => { })
//     // app.post('/protected', (req, res) => { })

createV1Routes.get('/health', (req, res) => res.status(200).send({ message: 'OK' }))

export default createV1Routes

