export class ApiResponse {
    constructor(statusCode, data) {
        this.statusCode = statusCode
        this.data = data
        this.success = statusCode < 400
    }

    getJsonResponse() {
        return {
            data: this.data,
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
    constructor(data) {
        super(204, [])
    }
}
