import { getFullUrl } from '../lib/getFullUrl.js';
import { ApiError } from '../errors.js';

export default class authController {
    constructor(userService) {
        this.userService = userService;
    }

    register = async (req, res, next) => {
        try {
            const user = await this.userService.create(req.body);
            res.status(201).json(user);
        } catch (err) {
            if (err instanceof ApiError) {
                err.setLink(getFullUrl(req));
            }

            next(err);
        }
    };
}