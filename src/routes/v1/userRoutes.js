import { Router } from 'express'
import updateUserRequest from '../../requests/user/updateUserRequest.js'
import { BadRequestError } from '../../utils/errors.js'
import { validateRequest } from '../../lib/validateRequest.js'
import { validateParams } from '../../lib/validateParams.js'

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
    router.get('/:id', (req, res, next) => {
        try {
            validateParams(req.params.id, 'user_id', 'integer')
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
        if (req.body === undefined) {
            throw new BadRequestError('Bad request', 'No fields to update', 'body')
        }

        validateRequest(req)
        try {
            userController.update(req, res, next)
        } catch (err) {
            next(err)
        }
    })

    return router
}

export default createUserRoutes
