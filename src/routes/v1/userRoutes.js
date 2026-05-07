import { Router } from 'express'

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
    router.get('/:id', userController.getById)

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
    router.post('/', userController.create)

    router.patch('/:id', userController.update)

    return router
}

export default createUserRoutes
