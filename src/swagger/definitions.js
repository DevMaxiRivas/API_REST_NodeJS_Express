// swagger/definitions.js
export default {
    User: {
        type: 'object',
        properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Leanne Graham' },
            username: { type: 'string', example: 'Bret' },
            email: { type: 'string', example: 'g****a@example.com' }
        }
    },
    ErrorResponse: {
        type: 'object',
        properties: {
            status: { type: 'string', example: 'error' },
            errors: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'UNAUTHORIZED' },
                        code: { type: 'integer', example: 401 },
                        title: { type: 'string', example: 'Unauthorized' },
                        detail: { type: 'string', example: 'Invalid token' },
                        source: {
                            type: 'object',
                            properties: {
                                pointer: { type: 'string', example: 'headers.authorization' }
                            }
                        },
                        links: {
                            type: 'object',
                            properties: {
                                about: { type: 'string', example: 'http://localhost:3000/api/v1/users' }
                            }
                        }
                    }
                }
            }
        }
    }
}
