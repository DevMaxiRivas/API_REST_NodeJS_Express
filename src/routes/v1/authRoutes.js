import { Router } from 'express'
import { validateRequest } from '../../lib/validateRequest.js'
import loginRequest from '../../requests/auth/loginRequest.js'
import { validateBody } from '../../lib/validateBody.js'
import registerRequest from '../../requests/auth/registerRequest.js'
import { validateWithoutSession } from '../../lib/validateWithoutSession.js'
import { validateExistsRefreshToken } from '../../lib/validateExistsRefreshToken.js'

const createAuthRoutes = (authController) => {
    const router = Router()

    router.post('/login', loginRequest, (req, res, next) => {
        validateWithoutSession(req, res)
        validateBody(req)
        validateRequest(req)
        try {
            authController.handleLogin(req, res, next)
        } catch (err) {
            next(err)
        }
    })

    router.post('/logout', (req, res, next) => {
        try {
            validateExistsRefreshToken(req)
            authController.handleLogout(req, res, next)
        } catch (err) {
            next(err)
        }
    })

    router.post('/register', registerRequest, (req, res, next) => {
        validateWithoutSession(req, res)
        validateBody(req)
        validateRequest(req)
        try {
            authController.handleRegister(req, res, next)
        } catch (err) {
            next(err)
        }
    })

    router.get('/refresh', (req, res, next) => {
        try {
            validateExistsRefreshToken(req)
            authController.handleRefreshToken(req, res, next)
        } catch (err) {
            next(err)
        }
    })

    return router
}

export default createAuthRoutes
