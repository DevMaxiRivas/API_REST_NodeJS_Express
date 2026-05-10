import 'dotenv/config.js'

export const PORT = process.env.PORT || 3000
export const DB_HOST = process.env.DB_HOST || 'localhost'
export const DB_USER = process.env.DB_USER || 'postgres'
export const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres'
export const DB_NAME = process.env.DB_NAME || 'postgres'
export const DB_PORT = process.env.DB_PORT || 5432

export const SECRET_JWT_KEY = process.env.SECRET_JWT_KEY || 'secret'
export const SECRET_JWT_REFRESH_KEY = process.env.SECRET_JWT_REFRESH_KEY || 'refreshSecret'
export const SERVER_URL = process.env.SERVER_URL

export const ENCRYPT_SALT = parseInt(process.env.ENCRYPT_SALT) || 10

export const NODE_ENV = process.env.NODE_ENV

export const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m'
export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'
