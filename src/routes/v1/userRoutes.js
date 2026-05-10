import { Router } from 'express'
import { validateRequest } from '../../lib/validateRequest.js'
import updateUserRequest from '../../requests/user/updateUserRequest.js'
import getUserRequest from '../../requests/user/getUserRequest.js'

const createUserRoutes = (userController) => {
    const router = Router()

    /**
     * @swagger
     * /users:
     *   get:
     *     summary: Get all users
     *     tags: [Users]
     *     responses:
     *       200:
     *         description: User List
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/User'
     */
    router.get('/', userController.getAll)

    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     summary: Get user by id
     *     tags: [Users]
     *     responses:
     *       200:
     *         description: Return user info
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/User'
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
     * /users:
     *   post:
     *     summary: Create a new user
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/NewUser'
     *     responses:
     *       201:
     *         description: User created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     */
    router.patch('/:id', updateUserRequest, (req, res, next) => {
        try {
            validateRequest(req)
            userController.update(req, res, next)
        } catch (err) {
            next(err)
        }
    })

    return router
}

export default createUserRoutes
