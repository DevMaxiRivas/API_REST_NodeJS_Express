import UserModel from '../models/userModel.js';

import bcrypt from 'bcrypt';

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

    async existsEmail(email) {
        const { rows } = await this.pool.query(
            'SELECT id FROM users WHERE email = $1', [email]
        );
        return rows[0] ? true : false;
    }

    async existsUsername(username) {
        const { rows } = await this.pool.query(
            'SELECT id FROM users WHERE username = $1', [username]
        );
        console.log(rows[0])
        return rows[0] ? true : false;
    }

    async create({ name, username, email, password }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const { rows } = await this.pool.query(
            'INSERT INTO users (name, username, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, username, email, hashedPassword]
        );
        return new UserModel(rows[0]);
    }
}

export default UserRepository;