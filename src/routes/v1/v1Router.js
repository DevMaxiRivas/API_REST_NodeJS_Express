// import { Router } from 'express'
import createUserRoutes from './userRoutes.js'
import { validationResult } from 'express-validator'
import { getFullUrl } from '../../lib/getFullUrl.js'
import { ValidationError } from '../../utils/errors.js'
import createUserRequest from '../../requests/user/createUserRequest.js'
import userController from '../../container.js'
import { Router } from 'express'

const createV1Routes = Router()

createV1Routes.use('/users', createUserRoutes(userController))

// app.post('/login', (req, res) => { })
createV1Routes.post('/register', createUserRequest, (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const validationError = errors.array()[0]

        throw new ValidationError(
            'Validation error: ' + validationError.msg,
            validationError.msg,
            validationError.location,
            getFullUrl(req)
        )
    }

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

