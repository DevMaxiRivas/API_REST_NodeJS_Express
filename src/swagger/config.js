import dotenv from 'dotenv'
import swaggerJsdoc from 'swagger-jsdoc'
import userSchemas from './definitions.js'

import { SERVER_URL } from '../config.js'

dotenv.config()
const serverURL = SERVER_URL
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API',
            version: '1.0.0',
            description: 'API Documentation'
        },

        servers: [
            {
                url: `${serverURL}/api/v1`,
                description: 'Version 1'
            },
            {
                url: `${serverURL}/api/v2`,
                description: 'Version 2'
            },
        ],
        components: {
            schemas: {
            },
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                },
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'refresh_token'
                }
            }
        }
    },
    apis: ['./src/routes/**/*.js'] // ajusta la ruta según tu proyecto
}

options.definition.components.schemas = {
    ...userSchemas,
};

const swaggerSpec = swaggerJsdoc(options)
export default swaggerSpec
