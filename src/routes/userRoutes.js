import { Router } from 'express'

const createUserRoutes = (userController) => {
    const router = Router()

    router.get('/', userController.getAll)
    router.get('/:id', userController.getById)
    router.post('/', userController.create)

    return router
}

export default createUserRoutes
