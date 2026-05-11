import { NODE_ENV } from '../config.js'
import userCreateDTO from '../dtos/userCreateDTO.js'
import { UserResponseDTO } from '../dtos/userResponseDTO.js'
import { generateToken } from '../lib/generateToken.js'
import { getFullUrl } from '../lib/getFullUrl.js'
import { createApiResponse } from '../utils/apiResponse.js'
export default class authController {
    constructor(authService) {
        this.authService = authService
    }

    static COOKIE_OPTIONS = {                       // OPTIONS
        httpOnly: true,     // unreachable from JS
        secure: NODE_ENV === 'production', // only sent over HTTPS
        SameSite: 'strict', // CSRF protection
        path: '/api/v1/auth/',
        maxAge: 7 * 24 * 60 * 60 * 1000
    }

    handleLogin = async (req, res, next) => {
        try {
            const { username, password } = req.body
            const { accessToken, refreshToken } = await this.authService.login(username, password)

            const responseData = createApiResponse(200, { access_token: accessToken })
            console.log(authController.COOKIE_OPTIONS)
            res
                .cookie('refresh_token', refreshToken, authController.COOKIE_OPTIONS)
                .status(responseData.statusCode)
                .json(responseData.getJsonResponse())
        } catch (err) {
            next(err)
        }
    }


    handleLogout = async (req, res, next) => {
        try {
            await this.authService.logout(req.cookies.refresh_token)
            res
                .clearCookie('refresh_token', {
                    httpOnly: true,
                    path: '/api/v1/auth/',
                    secure: NODE_ENV === 'production',
                    sameSite: 'strict'
                })
                .status(204)
                .send()
        } catch (err) {
            next(err)
        }
    }

    handleRegister = async (req, res, next) => {
        try {
            const { accessToken, refreshToken } = await this.authService.register(new userCreateDTO(req.body))
            const response = createApiResponse(201, { access_token: accessToken })
            res
                .cookie('refresh_token', refreshToken, authController.COOKIE_OPTIONS)
                .status(response.statusCode)
                .json(response.getJsonResponse())
        } catch (err) {
            next(err)

        }
    }

    handleRefresh = async (req, res, next) => {
        try {
            const accessToken = await this.authService.refresh(req.cookies.refresh_token)
            const response = createApiResponse(200, { access_token: accessToken })
            res.status(response.statusCode).json(response.getJsonResponse())
        } catch (err) {
            next(err)
        }
    }

}