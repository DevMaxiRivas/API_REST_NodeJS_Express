import { InternalError, ApiError } from './../errors.js'

import { getFullUrl } from './../lib/get-full-url.js'

const errorHandler = (err, req, res, next) => {
    console.log('Prueba handler', err)
    if (err instanceof ApiError) {
        res.status(parseInt(err.status)).json(err.getJsonResponse())
        return
    }

    console.error(err)
    const error = new InternalError('Intern server error', req.originalUrl, getFullUrl(req))
    res.status(parseInt(error.status)).json(error.getJsonResponse())
}

export default errorHandler
