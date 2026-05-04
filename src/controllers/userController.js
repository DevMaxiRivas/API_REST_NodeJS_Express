export default class userController {
    constructor(userService) {
        this.userService = userService; // inyectado
    }

    getAll = async (req, res, next) => {
        try {
            const users = await this.userService.getAll();
            res.json(users);
        } catch (err) { next(err); }
    };

    getById = async (req, res, next) => {
        try {
            const user = await this.userService.getById(req.params.id);
            res.json(user);
        } catch (err) { next(err); }
    };

    create = async (req, res, next) => {
        try {
            const user = await this.userService.create(req.body);
            res.status(201).json(user);
        } catch (err) { next(err); }
    };

    register = async (req, res, next) => {
        try {

            const user = await this.userService.create(req.body);
            res.status(201).json(user);
        } catch (err) { next(err); }
    };
}