import { InternalError } from './errors.js'

export class ApiResponse {
    constructor(statusCode, data) {
        this.statusCode = parseInt(statusCode)
        this.data = data
        this.success = statusCode < 400
    }

    getJsonResponse() {
        return {
            data: this.data,
            statusCode: this.statusCode,
            success: this.success
        }
    }
}

export class SuccessResponse extends ApiResponse {
    constructor(data) {
        super(200, data)
    }
}

export class CreatedResponse extends ApiResponse {
    constructor(data) {
        super(201, data)
    }
}

export class NoContentResponse extends ApiResponse {
    constructor() {
        super(204, [])
    }
}

export function createApiResponse(statusCode, data = null) {
    switch (statusCode) {
        case 200: return new SuccessResponse(data)
        case 201: return new CreatedResponse(data)
        case 204: return new NoContentResponse()
        default:
            throw new InternalError('CreateApiResponse: Status code not found', 'internal error')
    }
}
