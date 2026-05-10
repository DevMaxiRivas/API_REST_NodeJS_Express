import request from 'supertest'
import app from '../../app'
import pool from '../../config/database'

const urlBase = '/api/v1'

let token = ''
let refreshToken = ''
const uniqueID = Date.now().toString()
const username = `QAUsername${uniqueID}`
const pwd = 'pwd12345'

describe(`POST /api/v1/auth/register`, () => {
    it('Must register a new user and return a token', async () => {
        const newUser = {
            name: 'QA Name',
            username: username,
            email: `qa${uniqueID}@example.com`,
            password: pwd
        }
        const response = await request(app)
            .post(`${urlBase}/auth/register`)
            .send(newUser)
            .expect(201)

        expect(response.body).toHaveProperty('success', true)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveProperty('access_token')

        token = response.body.data.access_token
        const setCookieHeader = response.headers['set-cookie'];
        const refreshTokenCookie = setCookieHeader.find(cookie => cookie.startsWith('refresh_token='));
        refreshToken = refreshTokenCookie.split(';')[0].split('=')[1];
    })
})

describe(`POST /api/v1/auth/logout`, () => {
    it('The user should log out, must return 204', async () => {
        const response = await request(app)
            .post(`${urlBase}/auth/logout`)
            .set('Authorization', `Bearer ${token}`)
            .set('Cookie', `refresh_token=${refreshToken}`)
            .expect(204)

        expect(response.body).toEqual({})
    })
})

describe(`POST /api/v1/auth/login`, () => {
    it('The user should not be authenticated, must return 400', async () => {
        const user = {
            username: username,
            password: pwd
        }
        const response = await request(app)
            .post(`${urlBase}/auth/login`)
            .set('Authorization', `Bearer ${token}`)
            .send(user)
            .expect(400)

        expect(response.body).toHaveProperty('status', 'error')
    })

    it('The user should not be authenticated, Must return 401', async () => {
        const user = {
            username: username,
            password: "badpassword123"
        }
        const response = await request(app)
            .post(`${urlBase}/auth/login`)
            .send(user)
            .expect(401)

        expect(response.body).toHaveProperty('status', 'error')
    })

    it('The user should be authenticated', async () => {
        const user = {
            username: username,
            password: pwd
        }
        const response = await request(app)
            .post(`${urlBase}/auth/login`)
            .send(user)
            .expect(200)

        expect(response.body).toHaveProperty('success', true)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveProperty('access_token')

        token = response.body.data.access_token
    })
})

// describe(`PATCH /api/v1/me`, () => {
//     it('Must register a new user and return it', async () => {
//         const uniqueID = Date.now().toString()
//         const user = {
//             name: 'test',
//         }
//         const response = await request(app)
//             .patch(`${urlBase}/auth/register`)
//             .set('Cookie', `access_token=${token}`)
//             .send(user)
//             .expect(201)

//         expect(response.body).toHaveProperty('success', true)
//         expect(response.body).toHaveProperty('data')
//         expect(response.body.data).toHaveProperty('access_token')

//         token = response.body.data.access_token
//     })
// })


// Close the database connection
afterAll(async () => {
    await pool.end()
})