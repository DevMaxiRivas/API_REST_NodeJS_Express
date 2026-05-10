// File used to testing
import express from 'express'
import errorHandler from './middlewares/errorHandler.js'
import { getFullUrl } from './lib/getFullUrl.js'
import { NotFoundError } from './utils/errors.js'

import createV1Routes from './routes/v1/v1Router.js'
import cookieParser from 'cookie-parser'
import { SECRET_JWT_KEY } from './config.js'

import jwt from 'jsonwebtoken'

const app = express()
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

app.use((req, res) => {
    const error = new NotFoundError('Not found', 'path', getFullUrl(req))
    res.status(parseInt(error.status)).json(error.getJsonResponse())
})

app.use(errorHandler)

export default app
