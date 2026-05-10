import { InternalError, ApiError, BadRequestError, UnauthorizedError } from '../utils/errors.js'

import { getFullUrl } from '../lib/getFullUrl.js'

const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        err.setLink(getFullUrl(req))
        res.status(err.statusCode).json(err.getJsonResponse())
        return
    }

    if (err.name === 'JsonWebTokenError') {
        const error = new UnauthorizedError('JsonWebTokenError: Error with the token', 'Token is not valid', 'token', getFullUrl(req))
        res.status(error.statusCode).json(error.getJsonResponse())
        return
    }

    if (err.name === 'SyntaxError' && err.type === 'entity.parse.failed') {
        const error = new BadRequestError(err.message, 'The request body could not be parsed', 'body', getFullUrl(req))
        res.status(error.statusCode).json(error.getJsonResponse())
        return
    }

    console.error(err)
    const error = new InternalError('Intern server error', req.originalUrl, getFullUrl(req))
    res.status(error.statusCode).json(error.getJsonResponse())
}

export default errorHandler
