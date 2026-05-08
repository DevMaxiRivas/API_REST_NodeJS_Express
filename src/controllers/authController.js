import { getFullUrl } from '../lib/getFullUrl.js';
import { ApiError } from '../utils/errors.js';

export default class authController {
    constructor(userService) {
        this.userService = userService;
    }

    login = async (req, res, next) => {
        try {
            console.log(res.body)
            const { username, password } = req.body
            const user = await this.userService.login(username, password);
            res.status(200).json(user);
        } catch (err) {
            next(err);
        }
    };


    logout = async (req, res, next) => {
        try {
            const user = await this.userService.find(req.body);
            res.status(201).json(user);
        } catch (err) {
            next(err);
        }
    };
}