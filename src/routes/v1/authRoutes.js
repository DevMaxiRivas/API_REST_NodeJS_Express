import { Router } from 'express'
import { validateRequest } from '../../lib/validateRequest.js'
import loginRequest from '../../requests/auth/loginRequest.js'
import registerRequest from '../../requests/auth/registerRequest.js'
import logoutRequest from '../../requests/auth/logoutRequest.js'
import refreshRequest from '../../requests/auth/refreshRequest.js'

const createAuthRoutes = (authController) => {
    const router = Router()

    router.post('/login', loginRequest, (req, res, next) => {
        try {
            validateRequest(req)
            authController.handleLogin(req, res, next)
        } catch (err) {
            next(err)
        }
    })

    router.post('/logout', logoutRequest, (req, res, next) => {
        try {
            validateRequest(req)
            authController.handleLogout(req, res, next)
        } catch (err) {
            next(err)
        }
    })

    router.post('/register', registerRequest, (req, res, next) => {
        try {
            validateRequest(req)
            authController.handleRegister(req, res, next)
        } catch (err) {
            next(err)
        }
    })

    router.get('/refresh', refreshRequest, (req, res, next) => {
        try {
            validateRequest(req)
            authController.handleRefreshToken(req, res, next)
        } catch (err) {
            next(err)
        }
    })

    return router
}

export default createAuthRoutes
