import { Router } from 'express'
import { validateRequest } from '../../lib/validateRequest.js'
import updateUserRequest from '../../requests/user/updateUserRequest.js'
import getUserRequest from '../../requests/user/getUserRequest.js'
import getAllUserRequest from '../../requests/user/getAllUsersResquest.js'
import deleteUserRequest from '../../requests/user/deleteUserRequest.js'

const createUserRoutes = (userController) => {
    const router = Router()

    /**
     * @swagger
     * /users:
     *   get:
     *     summary: Get all users
     *     tags: [Users]
     *     description: |
     *       Returns a list of all users.
     *       **Validation:** The middleware `getAllUserRequest` validates that a valid JWT token is sent in the `Authorization` header.
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Successful response with users array
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: "#/components/schemas/User"
     *                 statusCode:
     *                   type: integer
     *                   example: 200
     *                 success:
     *                   type: string
     *                   example: "true"
     *       401:
     *         description: Unauthorized – invalid or missing token
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
     *                   detail: "Invalid token"
     *                   source:
     *                     pointer: "headers.authorization"
     *                   links:
     *                     about: "http://localhost:3000/api/v1/users"
     */
    router.get('/', getAllUserRequest, (req, res, next) => {
        try {
            validateRequest(req)
            userController.getAll(req, res, next)
        } catch (err) {
            next(err)
        }
    })

    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     summary: Get user by ID
     *     tags: [Users]
     *     description: |
     *       Returns the user data for the given ID.
     *       
     *       **Validations performed by `getUserRequest` middleware:**
     *       - Validates that the URL parameter `id` is a valid integer.
     *       - Verifies that a valid JWT token is sent in the `Authorization` header (Bearer token).
     *       - If the ID is not an integer, or the token is missing/invalid, a 422 error is returned.
     *     
     *     security:
     *       - bearerAuth: []
     *     
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Numeric ID of the user to retrieve.
     *         example: 123
     *     
     *     responses:
     *       200:
     *         description: User found – returns user data.
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
     *                     id:
     *                       type: integer
     *                       example: 123
     *                     name:
     *                       type: string
     *                       example: "Test Name"
     *                     username:
     *                       type: string
     *                       example: "testuser"
     *                     email:
     *                       type: string
     *                       example: "t*******r@example.com"
     *                       description: Masked email for privacy.
     *             example:
     *               success: true
     *               statusCode: 200
     *               data:
     *                 id: 123
     *                 name: "Test Name"
     *                 username: "testuser"
     *                 email: "t*******r@example.com"
     *       422:
     *         description: Unprocessable entity – validation error (invalid ID or missing/invalid token).
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/ErrorResponse"
     *             examples:
     *               missingAuth:
     *                 summary: Missing Authorization header
     *                 value:
     *                   status: "error"
     *                   errors:
     *                     - status: "VALIDATION_ERROR"
     *                       code: 422
     *                       title: "Invalid request"
     *                       detail: "Authorization is required"
     *                       source:
     *                         pointer: "headers.authorization"
     *                       links:
     *                         about: "http://localhost:3000/api/v1/users/123"
     *               invalidId:
     *                 summary: ID is not an integer
     *                 value:
     *                   status: "error"
     *                   errors:
     *                     - status: "VALIDATION_ERROR"
     *                       code: 422
     *                       title: "Invalid request"
     *                       detail: "User ID must be an integer"
     *                       source:
     *                         pointer: "path.id"
     *                       links:
     *                         about: "http://localhost:3000/api/v1/users/test1"
     *       401:
     *         description: Unauthorized – token expired or invalid signature (if your middleware returns 401 instead of 422).
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
     *                   detail: "Invalid token"
     *                   source:
     *                     pointer: "headers.authorization"
     */
    router.get('/:id', getUserRequest, (req, res, next) => {
        try {
            validateRequest(req)
            userController.getById(req, res, next)
        } catch (err) {
            next(err)
        }
    })

    /**
     * @swagger
     * /users/{id}:
     *   patch:
     *     summary: Update user data (partial)
     *     tags: [Users]
     *     description: |
     *       Updates one or more fields of an existing user. Only the fields sent in the body will be updated.
     *       
     *       **Validations performed by `updateUserRequest` middleware:**
     *       - Validates that the URL parameter `id` is a valid integer.
     *       - Verifies that a valid JWT token is sent in the `Authorization` header (Bearer token).
     *       - Checks that the request body contains at least one of the allowed fields: `name`, `username`, or `email`.
     *       - If the ID is not an integer, the token is missing/invalid, or no valid fields are provided, a 422 error is returned.
     *     
     *     security:
     *       - bearerAuth: []
     *     
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Numeric ID of the user to update.
     *         example: 123
     *     
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             minProperties: 1
     *             properties:
     *               name:
     *                 type: string
     *                 description: New full name.
     *                 example: "Test Update Name"
     *               username:
     *                 type: string
     *                 description: New username.
     *                 example: "updateduser"
     *               email:
     *                 type: string
     *                 format: email
     *                 description: New email address.
     *                 example: "newemail@example.com"
     *           example:
     *             name: "Test Update Name"
     *             username: "testuser"
     *           description: At least one of `name`, `username`, or `email` must be provided.
     *     
     *     responses:
     *       200:
     *         description: User updated successfully – returns updated user data.
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
     *                     id:
     *                       type: integer
     *                       example: 123
     *                     name:
     *                       type: string
     *                       example: "Test Update Name"
     *                     username:
     *                       type: string
     *                       example: "testuser"
     *                     email:
     *                       type: string
     *                       example: "t*******r@example.com"
     *                       description: Masked email for privacy.
     *             example:
     *               success: true
     *               statusCode: 200
     *               data:
     *                 id: 123
     *                 name: "Test Update Name"
     *                 username: "testuser"
     *                 email: "t*******r@example.com"
     *       400:
     *         description: Bad request – request body is empty or contains no valid updatable fields.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/ErrorResponse"
     *             example:
     *               status: "error"
     *               errors:
     *                 - status: "VALIDATION_ERROR"
     *                   code: 400
     *                   title: "Invalid request"
     *                   detail: "At least one field (name, username, email) must be provided"
     *                   source:
     *                     pointer: "body"
     *       422:
     *         description: Unprocessable entity – validation error (invalid ID, missing/invalid token, or duplicate email/username).
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/ErrorResponse"
     *             examples:
     *               missingAuth:
     *                 summary: Missing Authorization header
     *                 value:
     *                   status: "error"
     *                   errors:
     *                     - status: "VALIDATION_ERROR"
     *                       code: 422
     *                       title: "Invalid request"
     *                       detail: "Authorization is required"
     *                       source:
     *                         pointer: "headers.authorization"
     *                       links:
     *                         about: "http://localhost:3000/api/v1/users/123"
     *               invalidId:
     *                 summary: ID is not an integer
     *                 value:
     *                   status: "error"
     *                   errors:
     *                     - status: "VALIDATION_ERROR"
     *                       code: 422
     *                       title: "Invalid request"
     *                       detail: "User ID must be an integer"
     *                       source:
     *                         pointer: "path.id"
     *               duplicateEmail:
     *                 summary: Email already exists
     *                 value:
     *                   status: "error"
     *                   errors:
     *                     - status: "VALIDATION_ERROR"
     *                       code: 422
     *                       title: "Invalid request"
     *                       detail: "Email is already taken"
     *                       source:
     *                         pointer: "body.email"
     *       401:
     *         description: Unauthorized – token expired or invalid signature.
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
     *                   detail: "Invalid token"
     *                   source:
     *                     pointer: "headers.authorization"
     */
    router.patch('/:id', updateUserRequest, (req, res, next) => {
        try {
            validateRequest(req)
            userController.update(req, res, next)
        } catch (err) {
            next(err)
        }
    })

    /**
     * @swagger
     * /users/{id}:
     *   delete:
     *     summary: Delete a user
     *     tags: [Users]
     *     description: |
     *       Permanently deletes a user from the system by their ID.
     *       
     *       **Validations performed by `deleteUserRequest` middleware:**
     *       - Validates that the URL parameter `id` is a valid integer.
     *       - Verifies that a valid JWT token is sent in the `Authorization` header (Bearer token).
     *       - If the ID is not an integer or the token is missing/invalid, a 422 error is returned.
     *       - (Additional business logic, e.g., preventing self‑deletion, may also apply.)
     *     
     *     security:
     *       - bearerAuth: []
     *     
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Numeric ID of the user to delete.
     *         example: 123
     *     
     *     responses:
     *       200:
     *         description: User deleted successfully – returns the deleted user data.
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
     *                     id:
     *                       type: integer
     *                       example: 123
     *                     name:
     *                       type: string
     *                       example: "Test Name"
     *                     username:
     *                       type: string
     *                       example: "testuser"
     *                     email:
     *                       type: string
     *                       example: "t*******r@example.com"
     *                       description: Masked email for privacy.
     *             example:
     *               success: true
     *               statusCode: 200
     *               data:
     *                 id: 123
     *                 name: "Test Name"
     *                 username: "testuser"
     *                 email: "t*******r@example.com"
     *       422:
     *         description: Unprocessable entity – validation error (invalid ID or missing/invalid token).
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/ErrorResponse"
     *             examples:
     *               missingAuth:
     *                 summary: Missing Authorization header
     *                 value:
     *                   status: "error"
     *                   errors:
     *                     - status: "VALIDATION_ERROR"
     *                       code: 422
     *                       title: "Invalid request"
     *                       detail: "Authorization is required"
     *                       source:
     *                         pointer: "headers.authorization"
     *                       links:
     *                         about: "http://localhost:3000/api/v1/users/123"
     *               invalidId:
     *                 summary: ID is not an integer
     *                 value:
     *                   status: "error"
     *                   errors:
     *                     - status: "VALIDATION_ERROR"
     *                       code: 422
     *                       title: "Invalid request"
     *                       detail: "User ID must be an integer"
     *                       source:
     *                         pointer: "path.id"
     *               userNotFound:
     *                 summary: User does not exist (if validated)
     *                 value:
     *                   status: "error"
     *                   errors:
     *                     - status: "VALIDATION_ERROR"
     *                       code: 422
     *                       title: "Invalid request"
     *                       detail: "User not found"
     *                       source:
     *                         pointer: "path.id"
     *       401:
     *         description: Unauthorized – token expired or invalid signature.
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
     *                   detail: "Invalid token"
     *                   source:
     *                     pointer: "headers.authorization"
     */
    router.delete('/:id', deleteUserRequest, (req, res, next) => {
        try {
            validateRequest(req)
            userController.delete(req, res, next)
        } catch (err) {
            next(err)
        }
    })

    return router
}

export default createUserRoutes
