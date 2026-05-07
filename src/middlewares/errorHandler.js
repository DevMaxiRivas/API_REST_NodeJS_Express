import { InternalError, ApiError, BadRequestError } from '../utils/errors.js'

import { getFullUrl } from '../lib/getFullUrl.js'

const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        res.status(parseInt(err.status)).json(err.getJsonResponse())
        return
    }

    if (err.name === 'SyntaxError' && err.type === 'entity.parse.failed') {
        const error = new BadRequestError(err.message, 'The request body could not be parsed', 'body', getFullUrl(req))
        res.status(parseInt(error.status)).json(error.getJsonResponse())
        return
    }

    console.error(err)
    const error = new InternalError('Intern server error', req.originalUrl, getFullUrl(req))
    res.status(parseInt(error.status)).json(error.getJsonResponse())
}

export default errorHandler
