export class ApiError extends Error {
    constructor(message, statusCode, status, title, detail, source, link) {
        super(message)

        this.status = status
        this.statusCode = parseInt(statusCode)
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
                    'code': this.statusCode,
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
        super(message, 400, 'BAD_REQUEST', 'Bad request', detail, source, link)
    }
}

export class NotFoundError extends ApiError {
    constructor(message, source, link = null) {
        super(message, 404, 'NOT_FOUND', 'Not found', 'The resource you requested could not be found', source, link)
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message, title = 'You are not authorized to access this resource', source, link = null) {
        super(message, 401, 'UNAUTHORIZED', 'Unauthorized', title, source, link
        )
    }
}

export class ForbiddenError extends ApiError {
    constructor(message, source, link = null) {
        super(message, 403, 'FORBIDDEN', 'Forbidden', 'You do not have permission to access this resource', source, link
        )
    }
}

export class TimeoutError extends ApiError {
    constructor(message, source, link = null) {
        super(message, 408, 'TIMEOUT', 'Request Timeout', 'The request took too long to complete', source, link
        )
    }
}

export class ValidationError extends ApiError {
    constructor(message, detail, source, link = null) {
        super(message, 422, 'VALIDATION_ERROR', 'Invalid request', detail, source, link
        )
    }
}

export class InternalError extends ApiError {
    constructor(message, source, link = null) {
        super(message, 500, 'INTERNAL_ERROR', 'Internal error', 'An internal error occurred', source, link
        )
    }
}

export class ServiceUnavailableError extends ApiError {
    constructor(message, source, link = null) {
        super(message, 'A service we depend on is temporarily unavailable.', '503', 'SERVICE_UNAVAILABLE', 'Service unavailable', 'A service we depend on is temporarily unavailable.', source, link
        )
    }
}

export function createApiError(code, message, opts = {}) {
    const { detail, source, title } = opts

    const errorMap = {
        '400': { Class: BadRequestError, defaultDetail: 'Invalid request data', defaultTitle: 'Bad request' },
        '401': { Class: UnauthorizedError, defaultTitle: 'You are not authorized to access this resource' },
        '403': { Class: ForbiddenError },
        '404': { Class: NotFoundError },
        '408': { Class: TimeoutError },
        '422': { Class: ValidationError, defaultDetail: 'Request validation failed' },
        '500': { Class: InternalError },
        '503': { Class: ServiceUnavailableError }
    }

    const config = errorMap[code] || errorMap[code.toString()]
    if (!config) {
        return new InternalError('CreateApiError: Code not found', 'Internal error')
    }

    const { Class, defaultDetail, defaultTitle } = config

    switch (Class) {
        case BadRequestError:
            return new BadRequestError(message, detail || defaultDetail, source)
        case ValidationError:
            return new ValidationError(message, detail || defaultDetail, source)
        case NotFoundError:
            return new NotFoundError(message, source)
        case ForbiddenError:
            return new ForbiddenError(message, source)
        case TimeoutError:
            return new TimeoutError(message, source)
        case InternalError:
            return new InternalError(message, source)
        case UnauthorizedError:
            return new UnauthorizedError(message, title || defaultTitle, source)
        case ServiceUnavailableError:
            return new ServiceUnavailableError(message, source)
        default:
            return new Class(message, source) // fallback
    }
}
