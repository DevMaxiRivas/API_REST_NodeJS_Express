import { PORT, SECRET_JWT_KEY } from './config.js'
import express from 'express'
import errorHandler from './middlewares/errorHandler.js'
import { createApiError } from './utils/errors.js'

import createV1Routes from './routes/v1/v1Router.js'

import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './swagger/config.js'

import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'

const app = express()

app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`))
app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
    const authHeader = req.headers.authorization
    let token = null
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7)
    }

    req.session = { user: null }
    try {
        if (token) {
            req.session.user = jwt.verify(token, SECRET_JWT_KEY)
        }
        next()
    } catch (err) {
        console.log(err)
        next(err)
    }
})

app.use('/api/v1', createV1Routes)
// Ruta para Swagger UI
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
// app.use('/v1', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use((req, res) => {
    throw createApiError(404, 'The resource you requested could not be found', { source: 'path' })
})

app.use(errorHandler)
