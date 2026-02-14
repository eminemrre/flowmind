const request = require('supertest');
const app = require('../server');
const db = require('../config/database');

describe('Achievements Endpoints', () => {
    let token;
    let userId;
    const testUser = {
        email: 'achievementtest@example.com',
        password: 'Password123!',
        name: 'Achievement Tester'
    };

    beforeAll(async () => {
        // Cleanup
        await db.query('DELETE FROM users WHERE email = $1', [testUser.email]);

        // Register user
        const res = await request(app)
            .post('/auth/register')
            .send(testUser);

        token = res.body.token;
        userId = res.body.user.id;
    });

    afterAll(async () => {
        await db.query('DELETE FROM user_achievements WHERE user_id = $1', [userId]);
        await db.query('DELETE FROM users WHERE id = $1', [userId]);
        await db.pool.end();
    });

    it('should get all achievements', async () => {
        const res = await request(app)
            .get('/achievements')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        // Assuming there are seeded achievements
        if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty('title');
        }
    });

    it('should get user achievements', async () => {
        const res = await request(app)
            .get('/achievements/my')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });
});
