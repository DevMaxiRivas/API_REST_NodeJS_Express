export class ApiError extends Error {
    constructor(message, status, code, title, detail, source, link) {
        super(message)

        this.status = status
        this.code = code
        this.title = title
        this.detail = detail
        this.source = source
        this.link = link

        Error.captureStackTrace(this, this.constructor)
    }

    setLink(link) {
        this.link = link
    }

    getJsonResponse() {
        return {
            'status': 'error',
            'errors': [
                {
                    'status': `${this.status}`,
                    'code': `${this.code}`,
                    'title': `${this.title}`,
                    'detail': `${this.detail}`,
                    'source': {
                        'pointer': `${this.source}`
                    },
                    'links': {
                        'about': `${this.link ? this.link : ''}`
                    }
                }
            ]
        }
    }
}

export class BadRequestError extends ApiError {
    constructor(message, detail, source, link = null) {
        super(message, '400', 'BAD_REQUEST', 'Bad request', detail, source, link)
    }
}

export class NotFoundError extends ApiError {
    constructor(message, source, link = null) {
        super(message, '404', 'NOT_FOUND', 'Not found', 'The resource you requested could not be found', source, link)
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message, source, link = null) {
        super(message, '401', 'UNAUTHORIZED', 'Unauthorized', 'You are not authorized to access this resource', source, link
        )
    }
}

export class ForbiddenError extends ApiError {
    constructor(message, source, link = null) {
        super(message, '403', 'FORBIDDEN', 'Forbidden', 'You do not have permission to access this resource', source, link
        )
    }
}

export class TimeoutError extends ApiError {
    constructor(message, source, link = null) {
        super(message, '408', 'TIMEOUT', 'Request Timeout', 'The request took too long to complete', source, link
        )
    }
}

export class ValidationError extends ApiError {
    constructor(message, detail, source, link = null) {
        super(message, '422', 'VALIDATION_ERROR', 'Invalid request', detail, source, link
        )
    }
}

export class InternalError extends ApiError {
    constructor(message, source, link = null) {
        super(message, '500', 'INTERNAL_ERROR', 'Internal error', 'An internal error occurred', source, link
        )
    }
}

export class ServiceUnavailableError extends ApiError {
    constructor(message, source, link = null) {
        super(message, 'A service we depend on is temporarily unavailable.', '503', 'SERVICE_UNAVAILABLE', 'Service unavailable', 'A service we depend on is temporarily unavailable.', source, link
        )
    }
}
