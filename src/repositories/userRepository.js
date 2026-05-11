import UserModel from '../models/userModel.js';

import bcrypt from 'bcrypt';

class UserRepository {
    constructor(pool) {
        this.pool = pool; // inyectado
    }

    async findAll() {
        const { rows } = await this.pool.query('SELECT * FROM users ORDER BY id LIMIT 10');
        return rows.map(row => new UserModel(row));
    }

    async findById(id) {
        const { rows } = await this.pool.query(
            'SELECT * FROM users WHERE id = $1', [id]
        );
        return rows[0] ? new UserModel(rows[0]) : null;
    }

    async findByUsername(username) {
        const { rows } = await this.pool.query(
            'SELECT * FROM users WHERE username = $1', [username]
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
        return rows[0] ? true : false;
    }

    async create({ name, username, email, password, tokens = null }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const { rows } = await this.pool.query(
            'INSERT INTO users (name, username, email, password, tokens) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, username, email, hashedPassword, tokens]
        );
        return new UserModel(rows[0]);
    }

    async update(id, data) {
        const cols = Object.keys(data);
        const values = Object.values(data);
        let userData = {}

        if (cols.length > 1) {

            let parametersQuery = [];
            for (let i = 1; i <= cols.length; i++) {
                parametersQuery.push("$" + i);
            }

            const { rows } = await this.pool.query(
                `UPDATE users SET (${cols}) = (${parametersQuery.join(', ')}) WHERE id = $${cols.length + 1} RETURNING *`,
                [...values, id]
            );

            userData = rows[0]
        } else {
            const { rows } = await this.pool.query(
                `UPDATE users SET ${cols[0]} = $1 WHERE id = $2 RETURNING *`,
                [values[0], id]
            );
            userData = rows[0]
        }

        return new UserModel(userData);
    }

    async delete(id) {
        const { rows } = await this.pool.query(
            'DELETE FROM users WHERE id = ($1) RETURNING *',
            [id]
        );
        return new UserModel(rows[0]);
    }
}

export default UserRepository;