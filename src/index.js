import { PORT } from './config.js'
import express from 'express'
import errorHandler from './middlewares/errorHandler.js'
import { getFullUrl } from './lib/get-full-url.js'
import { NotFoundError } from './errors.js'

import createV1Routes from './routes/v1/v1Router.js'

const app = express()

app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`))
app.use(express.json())

app.use('/api/v1', createV1Routes)

app.use((req, res) => {
    console.log(getFullUrl(req))
    const error = new NotFoundError('Not found', 'path', getFullUrl(req))
    res.status(parseInt(error.status)).json(error.getJsonResponse())
})

app.use(errorHandler)
