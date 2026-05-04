import { PORT } from './config.js'

import express from 'express'
import createUserRoutes from './routes/userRoutes.js'
import userController from './container.js'
import errorHandler from './middlewares/errorHandler.js'
import { validationResult } from 'express-validator'

import { NotFoundError, ValidationError } from './errors.js'

import createUserRequest from './requests/user/createUserRequest.js'
import { getFullUrl } from './lib/get-full-url.js'
// import createUserRequest from './requests/product/createUserRequest.js'

// import { validationResult } from 'express-validator'

const app = express()

app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`))
app.use(express.json())

app.use('/api/users', createUserRoutes(userController))
// app.post('/login', (req, res) => { })
app.post('/api/register', createUserRequest, (req, res, next) => {
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
        userController.register(req, res, next)
    } catch (err) {
        next(err)
    }
})
// app.post('/logout', (req, res) => { })
// app.post('/protected', (req, res) => { })

// app.get('/health', (req, res) => res.send('OK'))

app.use(errorHandler)

app.use((req, res) => {
    console.log(getFullUrl(req))
    const error = new NotFoundError('Not found', 'path', getFullUrl(req))
    res.status(parseInt(error.status)).json(error.getJsonResponse())
})

