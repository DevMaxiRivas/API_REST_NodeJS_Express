import request from 'supertest';
import app from '../../app';
import pool from '../../config/database';

const urlBase = '/api/v1'

describe(`GET /api/v1/users`, () => {
    it('Must return a list of users', async () => {
        const response = await request(app)
            .get(`${urlBase}/users`)
            .expect('Content-Type', /json/)
            .expect(200);

        // Check response structure
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);

        // Element validations
        if (response.body.data.length > 0) {
            const firstUser = response.body.data[0];
            expect(firstUser).toHaveProperty('id');
            expect(firstUser).toHaveProperty('username');
            expect(firstUser).toHaveProperty('email');

            expect(typeof firstUser.email).toBe('string');
            // Fromat validate email [something]@[something].[something]
            expect(firstUser.email).toMatch(/^[^@]+@[^@]+\.[^@]+$/);
        }
    });
});

// describe(`POST /api/v1/users`, () => {
//     it('Must create a new user and return it', async () => {
//         const uniqueID = Date.now().toString();
//         const newUser = {
//             name: "QA Name",
//             username: `QAUsername${uniqueID}`,
//             email: `qa${uniqueID}@example.com`,
//             password: "pwd12345"
//         }
//         const response = await request(app)
//             .post(`${urlBase}/users`)
//             .send(newUser)
//             .expect(201);

//         expect(response.body).toHaveProperty('success', true);
//         expect(response.body).toHaveProperty('data');
//         expect(Array.isArray(response.body.data)).toBe(true);
//     });

//     it('Must return 400', async () => {
//         const response = await request(app)
//             .post(`${urlBase}/users`)
//             .send({})
//             .expect(400);

//         expect(response.body.error).toBe('Name required');
//     });
// });

// Close the database connection
afterAll(async () => {
    await pool.end(); // Cierra todas las conexiones del pool
});