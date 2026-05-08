import request from 'supertest';
import app from '../../app';
import pool from '../../config/database';

const urlBase = '/api/v1'

describe(`POST ${urlBase}/login`, () => {
    it('Must create a new user and return it', async () => {
        const user = {
            name: "QA Name",
            username: `QAUsername`,
            email: `qa@example.com`,
            password: "pwd12345"
        }
        const response = await request(app)
            .post(`${urlBase}/login`)
            .send(user)
            .expect(200);

    });

    it('Must create a new user and return it', async () => {
        const user = {
            name: "QA Name",
            username: `QAUsername`,
            email: `qa@example.com`,
            password: "awdawdad"
        }
        const response = await request(app)
            .post(`${urlBase}/login`)
            .send(user)
            .expect(401);
    });

});

// Close the database connection
afterAll(async () => {
    await pool.end(); // Cierra todas las conexiones del pool
});