import { Router } from 'express'
import { validateRequest } from '../../lib/validateRequest.js'
import loginRequest from '../../requests/auth/loginRequest.js'
import registerRequest from '../../requests/auth/registerRequest.js'
import logoutRequest from '../../requests/auth/logoutRequest.js'
import refreshRequest from '../../requests/auth/refreshRequest.js'

const createAuthRoutes = (authController) => {
    const router = Router()

    /**
     * @swagger
     * /api/v1/auth/login:
     *   post:
     *     summary: Login
     *     tags: [Auth]
     *     description: |
     *       Authenticates a user and returns an access token (in body) and a refresh token (in HttpOnly cookie).
     *       **Validations performed by loginRequest middleware:**
     *       - Ensures no Authorization header (JWT token) is present – if present, request is rejected.
     *       - Validates that username and password are provided in the request body.
     *       - (If missing or invalid credentials, returns 422 with detailed error.)
     *
     *     security:
     *       - bearerAuth: []
     *
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - username
     *               - password
     *             properties:
     *               username:
     *                 type: string
     *                 example: "testuser@example.com"
     *                 description: User's email or username
     *               password:
     *                 type: string
     *                 format: password
     *                 example: "pwd12345678"
     *                 description: User's password
     *           example:
     *             username: "testuser@example.com"
     *             password: "pwd12345678"
     *
     *     responses:
     *       200:
     *         description: Login successful – access token returned in body, refresh token set as cookie
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               required:
     *                 - success
     *                 - statusCode
     *                 - data
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 statusCode:
     *                   type: integer
     *                   example: 200
     *                 data:
     *                   type: object
     *                   properties:
     *                     access_token:
     *                       type: string
     *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJ1c2VybmFtZSI6IjFRQVVzZXJuYW1lIiwiaWF0IjoxNzc4NDU3MTE5LCJleHAiOjE3Nzg0NTgwMTl9.yrp9uw1sL9Bfw413BVa-XQ19XnJHCnj6Z1oP5CzM6ms"
     *                       description: New JWT access token (short-lived)
     *         headers:
     *           Set-Cookie:
     *             schema:
     *               type: string
     *               example: "refresh_token=eyJhbGciOiJIUzI1NiIs...; HttpOnly; Secure; SameSite=None; Path=/api/v1/auth; Expires=Mon, 10 Jan 2023 00:00:00 GMT"
     *             description: |
     *               HttpOnly, Secure cookie containing the refresh token.
     *               - `HttpOnly` prevents client-side script access.
     *               - `Secure` ensures cookie is sent only over HTTPS.
     *               - `SameSite=None` allows cross-site requests (if needed).
     *               - `Path=/api/v1/auth` restricts cookie to auth endpoints.
     *       401:
     *         description: Unauthorized – an Authorization header (JWT) was sent to the login endpoint
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/ErrorResponse"
     *             example:
     *               status: "error"
     *               errors:
     *                 - status: "UNAUTHORIZED"
     *                   code: 401
     *                   title: "Unauthorized"
     *                   detail: "Authorization header should not exist"
     *                   source:
     *                     pointer: "headers.authorization"
     *       422:
     *         description: Unprocessable entity – invalid username or password
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/ErrorResponse"
     *             example:
     *               status: "error"
     *               errors:
     *                 - status: "VALIDATION_ERROR"
     *                   code: 422
     *                   title: "Invalid request"
     *                   detail: "Invalid username or password"
     *                   source:
     *                     pointer: "body"
     *                   links:
     *                     about: "http://localhost:3000/api/v1/auth/login"
     */
    router.post('/login', loginRequest, (req, res, next) => {
        try {
            validateRequest(req)
            authController.handleLogin(req, res, next)
        } catch (err) {
            next(err)
        }
    })

    /**
     * @swagger
     * /api/v1/auth/logout:
     *   post:
     *     summary: User logout
     *     tags: [Auth]
     *     description: |
     *       Invalidates the refresh token and clears the `refresh_token` cookie.
     *       
     *       **Validations performed by `logoutRequest` middleware:**
     *       - Verifies that the client sends a `refresh_token` cookie (JWT token).
     *       - If the cookie is missing or invalid, the request is rejected with a 422 error.
     *       - On success, the cookie is cleared and no content is returned.
     *     
     *     security:
     *       - cookieAuth: []
     *     
     *     parameters:
     *       - in: cookie
     *         name: refresh_token
     *         required: true
     *         schema:
     *           type: string
     *         description: JWT refresh token (HttpOnly, Secure cookie) sent by the server on login/register.
     *     
     *     responses:
     *       204:
     *         description: Logout successful – refresh_token cookie cleared. No response body.
     *         headers:
     *           Set-Cookie:
     *             schema:
     *               type: string
     *               example: "refresh_token=; HttpOnly; Secure; SameSite=None; Path=/api/v1/auth; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
     *             description: Clears the refresh_token cookie by setting an expired date.
     *       422:
     *         description: Unprocessable entity – refresh_token cookie is missing or invalid
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/ErrorResponse"
     *             example:
     *               status: "error"
     *               errors:
     *                 - status: "VALIDATION_ERROR"
     *                   code: 422
     *                   title: "Invalid request"
     *                   detail: "refresh_token cookie is required"
     *                   source:
     *                     pointer: "cookie"
     *                   links:
     *                     about: "http://localhost:3000/api/v1/auth/logout"
     */
    router.post('/logout', logoutRequest, (req, res, next) => {
        try {
            validateRequest(req)
            authController.handleLogout(req, res, next)
        } catch (err) {
            next(err)
        }
    })

    /**
     * @swagger
     * /api/v1/auth/register:
     *   post:
     *     summary: Register a new user
     *     tags: [Auth]
     *     description: |
     *       Creates a new user account and returns an access token (in body) and a refresh token (in HttpOnly cookie).
     *       
     *       **Validations performed by `registerRequest` middleware:**
     *       - Rejects requests that include an `Authorization` header (JWT token) – login is not allowed while already authenticated.
     *       - Requires the following fields in the request body: `name`, `email`, `username`, `password`.
     *       - Additional password strength validation (e.g., minimum 8 characters) is applied – failure returns 422.
     *     
     *     security:
     *       - bearerAuth: []
     *     
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - email
     *               - username
     *               - password
     *             properties:
     *               name:
     *                 type: string
     *                 example: "Test User"
     *                 description: Full name of the user
     *               email:
     *                 type: string
     *                 format: email
     *                 example: "testuser@example.com"
     *                 description: Unique email address
     *               username:
     *                 type: string
     *                 example: "testuser"
     *                 description: Unique username
     *               password:
     *                 type: string
     *                 format: password
     *                 example: "pwd12345"
     *                 description: Password (minimum 8 characters, etc.)
     *           example:
     *             name: "Test User"
     *             username: "testuser"
     *             email: "testuser@example.com"
     *             password: "pwd12345"
     *     
     *     responses:
     *       201:
     *         description: User successfully created – access token returned in body, refresh token set as cookie
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               required:
     *                 - success
     *                 - statusCode
     *                 - data
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 statusCode:
     *                   type: integer
     *                   example: 200
     *                 data:
     *                   type: object
     *                   properties:
     *                     access_token:
     *                       type: string
     *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJ1c2VybmFtZSI6IjFRQVVzZXJuYW1lIiwiaWF0IjoxNzc4NDU3MTE5LCJleHAiOjE3Nzg0NTgwMTl9.yrp9uw1sL9Bfw413BVa-XQ19XnJHCnj6Z1oP5CzM6ms"
     *                       description: New JWT access token (short-lived)
     *         headers:
     *           Set-Cookie:
     *             schema:
     *               type: string
     *               example: "refresh_token=eyJhbGciOiJIUzI1NiIs...; HttpOnly; Secure; SameSite=None; Path=/api/v1/auth; Expires=Mon, 10 Jan 2023 00:00:00 GMT"
     *             description: |
     *               HttpOnly, Secure cookie containing the refresh token.
     *               - `HttpOnly` prevents client-side script access.
     *               - `Secure` ensures cookie is sent only over HTTPS.
     *               - `SameSite=None` allows cross-site requests (if needed).
     *               - `Path=/api/v1/auth` restricts cookie to auth endpoints.
     *       401:
     *         description: Unauthorized – an Authorization header (JWT token) was sent to the register endpoint
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/ErrorResponse"
     *             example:
     *               status: "error"
     *               errors:
     *                 - status: "UNAUTHORIZED"
     *                   code: 401
     *                   title: "Token not allowed"
     *                   detail: "Register endpoint does not accept credentials header"
     *                   source:
     *                     pointer: "headers.authorization"
     *       422:
     *         description: Unprocessable entity – validation error (e.g., password too short, email already exists, etc.)
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/ErrorResponse"
     *             example:
     *               status: "error"
     *               errors:
     *                 - status: "VALIDATION_ERROR"
     *                   code: 422
     *                   title: "Invalid request"
     *                   detail: "Password must be at least 8 chars long"
     *                   source:
     *                     pointer: "body"
     *                   links:
     *                     about: "http://localhost:3000/api/v1/auth/register"
     */
    router.post('/register', registerRequest, (req, res, next) => {
        try {
            validateRequest(req)
            authController.handleRegister(req, res, next)
        } catch (err) {
            next(err)
        }
    })

    /**
     * @swagger
     * /api/v1/auth/refresh:
     *   get:
     *     summary: Refresh access token
     *     tags: [Auth]
     *     description: |
     *       Generates a new access token using a valid refresh token sent in the `refresh_token` cookie.
     *       
     *       **Validations performed by `refreshRequest` middleware:**
     *       - Checks that a `refresh_token` cookie is present in the request.
     *       - Verifies the JWT refresh token (signature, expiration, integrity).
     *       - If the cookie is missing or invalid, the request is rejected with a 422 error.
     *     
     *     security:
     *       - cookieAuth: []
     *     
     *     parameters:
     *       - in: cookie
     *         name: refresh_token
     *         required: true
     *         schema:
     *           type: string
     *         description: JWT refresh token (HttpOnly, Secure cookie) obtained from login or register.
     *     
     *     responses:
     *       200:
     *         description: New access token generated successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               required:
     *                 - success
     *                 - statusCode
     *                 - data
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 statusCode:
     *                   type: integer
     *                   example: 200
     *                 data:
     *                   type: object
     *                   properties:
     *                     access_token:
     *                       type: string
     *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJ1c2VybmFtZSI6IjFRQVVzZXJuYW1lIiwiaWF0IjoxNzc4NDU3MTE5LCJleHAiOjE3Nzg0NTgwMTl9.yrp9uw1sL9Bfw413BVa-XQ19XnJHCnj6Z1oP5CzM6ms"
     *                       description: New JWT access token (short-lived)
     *             example:
     *               success: true
     *               statusCode: 200
     *               data:
     *                 access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJ1c2VybmFtZSI6IjFRQVVzZXJuYW1lIiwiaWF0IjoxNzc4NDU3MTE5LCJleHAiOjE3Nzg0NTgwMTl9.yrp9uw1sL9Bfw413BVa-XQ19XnJHCnj6Z1oP5CzM6ms"
     *       422:
     *         description: Unprocessable entity – refresh_token cookie is missing or invalid.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/ErrorResponse"
     *             example:
     *               status: "error"
     *               errors:
     *                 - status: "VALIDATION_ERROR"
     *                   code: 422
     *                   title: "Invalid request"
     *                   detail: "refresh_token cookie is required"
     *                   source:
     *                     pointer: "cookie"
     *                   links:
     *                     about: "http://localhost:3000/api/v1/auth/refresh"
     */
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
