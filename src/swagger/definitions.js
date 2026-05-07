// swagger/definitions.js
export default {
    User: {
        type: 'object',
        properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Ana' },
            email: { type: 'string', example: 'ana@example.com' }
        }
    },
    NewUser: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
            name: { type: 'string', example: 'Juan' },
            email: { type: 'string', example: 'juan@example.com' }
        }
    }
}
