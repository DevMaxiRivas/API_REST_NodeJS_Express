import { BadRequestError, InternalError } from '../utils/errors.js'

export function validateParams(param, resource, type = 'integer') {
    if (param === undefined) {
        throw new BadRequestError('Params not found', 'id')
    }

    switch (type) {
        case 'integer': {
            if (Number.isInteger(Number(param)) === false) {
                throw new BadRequestError('ValidateParams: Type ', 'URL param invalid', resource)
            }
        }
            break
        default: {
            throw new InternalError('ValidateParams: Type not found', resource)
        }
    }
}
