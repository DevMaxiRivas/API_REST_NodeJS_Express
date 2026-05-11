import { getFullUrl } from '../lib/getFullUrl.js'
import { ApiError, BadRequestError, NotFoundError, ValidationError } from '../utils/errors.js'
import { createApiResponse } from '../utils/apiResponse.js'
import { response } from 'express'

import { UserResponseDTO } from '../dtos/userResponseDTO.js'
import userUpdateDTO from '../dtos/userUpdateDTO.js'
import userCreateDTO from '../dtos/userCreateDTO.js'

export default class userController {
    constructor(userService) {
        this.userService = userService // inyectado
    }

    getAll = async (req, res, next) => {
        try {
            const users = await this.userService.getAll()
            const response = createApiResponse(200, users.map(user => (new UserResponseDTO(user)).getJsonResponse()))
            res.status(response.statusCode).json(response.getJsonResponse())

        } catch (err) {
            next(err)
        }
    }

    getById = async (req, res, next) => {
        try {
            const user = await this.userService.getById(req.params.id)
            const response = createApiResponse(200, (new UserResponseDTO(user)).getJsonResponse())
            res.status(response.statusCode).json(response.getJsonResponse())
        } catch (err) {
            next(err)
        }
    }

    create = async (req, res, next) => {
        try {
            const user = await this.userService.create(new userCreateDTO(req.body))
            const response = createApiResponse(201, (new UserResponseDTO(user)).getJsonResponse())
            res.status(response.statusCode).json(response.getJsonResponse())
        } catch (err) {
            next(err)
        }
    }

    update = async (req, res, next) => {
        try {
            const dto = new userUpdateDTO(req.body)
            const data = dto.getFilledFields()

            if (Object.keys(data).length === 0) {
                throw new ValidationError('Validation Error', 'No fields to update', 'body')
            }

            const user = await this.userService.update(req.params.id, data)
            const response = createApiResponse(200, (new UserResponseDTO(user)).getJsonResponse())
            res.status(response.statusCode).json(response.getJsonResponse())
        } catch (err) {
            next(err)

        }
    }

    delete = async (req, res, next) => {
        try {
            const user = await this.userService.delete(req.params.id)
            const response = createApiResponse(200, (new UserResponseDTO(user)).getJsonResponse())
            res.status(response.statusCode).json(response.getJsonResponse())
        } catch (err) {
            next(err)

        }
    }


    updateAuthUser = async (req, res, next) => {
        try {
            const { id, username } = req.session.user
            const dto = new userUpdateDTO(req.body)
            const data = dto.getFilledFields()

            if (Object.keys(data).length === 0) {
                throw new ValidationError('Validation Error', 'No fields to update', 'body')
            }

            const user = await this.userService.update(id, data)
            const response = createApiResponse(200, (new UserResponseDTO(user)).getJsonResponse())
            res.status(response.statusCode).json(response.getJsonResponse())
        } catch (err) {
            next(err)
        }
    }

}