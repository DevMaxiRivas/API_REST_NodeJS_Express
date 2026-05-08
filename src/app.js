// File used to testing
import express from 'express'
import errorHandler from './middlewares/errorHandler.js'
import { getFullUrl } from './lib/getFullUrl.js'
import { NotFoundError } from './utils/errors.js'

import createV1Routes from './routes/v1/v1Router.js'

const app = express()
app.use(express.json())

app.use('/api/v1', createV1Routes)

app.use((req, res) => {
    const error = new NotFoundError('Not found', 'path', getFullUrl(req))
    res.status(parseInt(error.status)).json(error.getJsonResponse())
})

app.use(errorHandler)

export default app
