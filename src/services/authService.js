import { createApiError, NotFoundError, UnauthorizedError, ValidationError } from '../utils/errors.js'
import UserModel from '../models/userModel.js'
import userUpdateDTO from '../dtos/userUpdateDTO.js'

import bcrypt from 'bcrypt'
import { generateToken } from '../lib/generateToken.js'
import { addTokenToList, removeTokenFromList } from '../lib/manageRefreshToken.js'
import { ENCRYPT_SALT, SECRET_JWT_REFRESH_KEY } from '../config.js'
import { arrayToString } from '../lib/databaseMapping.js'

import jwt from 'jsonwebtoken'

export default class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository
    }

    async login(username, password) {
        const user = await this.userRepository.findByUsername(username)
        if (!user) {
            throw createApiError(401, 'Unauthorized Error', { title: 'Authentication failed. User not found.', source: 'body.username' })
        }

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
            throw createApiError(401, 'Unauthorized Error', { title: 'Authentication failed. Wrong password.', source: 'body.password' })
        }

        const refreshToken = generateToken(user, 'refresh', '7d')
        const accessToken = generateToken(user, 'access', '1h')

        const refreshTokenHash = await bcrypt.hash(refreshToken, ENCRYPT_SALT)
        const tokenHashList = addTokenToList(user.tokens, refreshTokenHash)

        await this.userRepository.update(user.id, { tokens: arrayToString(tokenHashList) })

        return { accessToken, refreshToken }
    }

    async logout(refreshToken) {
        try {
            const { id } = jwt.verify(refreshToken, SECRET_JWT_REFRESH_KEY)
            const user = await this.userRepository.findById(id)

            if (!user) {
                throw createApiError(403, 'Forbidden Error', { detail: 'Invalid refresh token', source: 'cookie' })
            }

            const refreshTokenHash = await bcrypt.hash(refreshToken, ENCRYPT_SALT)
            const tokenHashList = removeTokenFromList(user.tokens, refreshTokenHash)

            await this.userRepository.update(user.id, { tokens: arrayToString(tokenHashList) })
        } catch (err) {
            throw createApiError(401, 'Unauthorized Error', { title: 'Authentication failed. Invalid token.', source: 'cookie' })
        }
    }

    async register(data) {
        const existEmail = await this.userRepository.existsEmail(data.email)
        const existUsername = await this.userRepository.existsUsername(data.username)

        if (existEmail) {
            throw createApiError(422, 'Validation Error', { detail: 'This email address has already been registered', source: 'body.email' })
        }

        if (existUsername) {
            throw createApiError(422, 'Validation Error', { detail: 'This username has already been registered', source: 'body.username' })
        }

        const user = await this.userRepository.create(data)

        const refreshToken = generateToken(user, 'refresh', '7d')
        const accessToken = generateToken(user, 'access', '1h')

        const refreshTokenHash = await bcrypt.hash(refreshToken, ENCRYPT_SALT)
        const tokenHashList = addTokenToList([], refreshTokenHash)

        await this.userRepository.update(user.id, { tokens: arrayToString(tokenHashList) })

        return { accessToken, refreshToken }
    }

    async refresh(refreshToken) {
        try {
            const { id } = jwt.verify(refreshToken, SECRET_JWT_REFRESH_KEY)
            const user = await this.userRepository.findById(id)

            if (!user) {
                throw createApiError(403, 'Forbidden Error', { detail: 'Invalid refresh token', source: 'cookie' })
            }

            const currentTokenHashList = user.tokens
            refreshTokenHash = await bcrypt.hash(refreshToken, ENCRYPT_SALT)

            if (!currentTokenHashList.includes(refreshTokenHash)) {
                throw createApiError(403, 'Forbidden Error', { detail: 'Invalid refresh token', source: 'cookie' })
            }

            const accessToken = generateToken(user, 'access', '1h')
            return { accessToken }

        } catch (err) {
            throw createApiError(403, 'Forbidden Error', { detail: 'Invalid refresh token', source: 'cookie' })
        }
    }
}