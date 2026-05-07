import { PORT } from './config.js'
import express from 'express'
import errorHandler from './middlewares/errorHandler.js'
import { getFullUrl } from './lib/getFullUrl.js'
import { NotFoundError } from './utils/errors.js'

import createV1Routes from './routes/v1/v1Router.js'

import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './swagger/config.js'

const app = express()

app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`))
app.use(express.json())

app.use('/api/v1', createV1Routes)
// Ruta para Swagger UI
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/v1', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use((req, res) => {
    const error = new NotFoundError('Not found', 'path', getFullUrl(req))
    res.status(parseInt(error.status)).json(error.getJsonResponse())
})

app.use(errorHandler)
