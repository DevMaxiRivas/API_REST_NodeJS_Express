import UserModel from '../models/userModel.js';

class UserRepository {
    constructor(pool) {
        this.pool = pool; // inyectado
    }

    async findAll() {
        const { rows } = await this.pool.query('SELECT * FROM users ORDER BY id');
        return rows.map(row => new UserModel(row));
    }

    async findById(id) {
        const { rows } = await this.pool.query(
            'SELECT * FROM users WHERE id = $1', [id]
        );
        return rows[0] ? new UserModel(rows[0]) : null;
    }

    async create({ name, email }) {
        const { rows } = await this.pool.query(
            'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );
        return new UserModel(rows[0]);
    }
}

export default UserRepository;