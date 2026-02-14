const request = require('supertest');
const app = require('../server');
const db = require('../config/database');

describe('Auth Endpoints', () => {
    let testUser = {
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User'
    };

    // Clean up before tests
    beforeAll(async () => {
        await db.query('DELETE FROM users WHERE email = $1', [testUser.email]);
    });

    afterAll(async () => {
        await db.query('DELETE FROM users WHERE email = $1', [testUser.email]);
        await db.pool.end();
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send(testUser);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('email', testUser.email);
    });

    it('should not register existing user', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send(testUser);

        expect(res.statusCode).toEqual(400); // Or 409 depending on implementation
    });

    it('should login successfully', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should fail login with wrong password', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: testUser.email,
                password: 'WrongPassword'
            });

        expect(res.statusCode).toEqual(401); // Or 400
    });
});
