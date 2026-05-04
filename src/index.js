import { PORT } from './config.js'

import express from 'express'
import createUserRoutes from './routes/userRoutes.js'
import userController from './container.js'
import errorHandler from './middlewares/errorHandler.js'
// import createUserRequest from './requests/product/createUserRequest.js'

// import { validationResult } from 'express-validator'

const app = express()

app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`))
app.use(express.json())

app.use('/api/users', createUserRoutes(userController))
// app.post('/login', (req, res) => { })
// app.post('/register', createUserRequest, (req, res, next) => {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() })
//     }

//     userController.register(req, res, next)
// })
// app.post('/logout', (req, res) => { })
// app.post('/protected', (req, res) => { })

// app.get('/health', (req, res) => res.send('OK'))

app.use(errorHandler)

