const request = require('supertest');
const app = require('../server');
const db = require('../config/database');

// ⚠️ Rotalar server.js içinde `/api` ön ekiyle bağlanır (app.use('/api/auth', ...)).
// Bu dosyadaki yollar 2026-10-18'e kadar `/auth/...` idi ve 404 döndüğü için
// backend testleri hiç geçmiyordu, CI aylardır kırmızıydı.
const API = '/api/auth';

describe('Auth Endpoints', () => {
    const testUser = {
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
    };

    let token;

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
            .post(`${API}/register`)
            .send(testUser);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('email', testUser.email);
    });

    it('should not register existing user', async () => {
        const res = await request(app)
            .post(`${API}/register`)
            .send(testUser);

        expect(res.statusCode).toEqual(400);
    });

    it('should login successfully', async () => {
        const res = await request(app)
            .post(`${API}/login`)
            .send({ email: testUser.email, password: testUser.password });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');

        token = res.body.token;
    });

    it('should fail login with wrong password', async () => {
        const res = await request(app)
            .post(`${API}/login`)
            .send({ email: testUser.email, password: 'WrongPassword' });

        expect(res.statusCode).toEqual(401);
    });

    // --- Hesap silme (App Store 5.1.1(v)) ---

    it('should reject account deletion without a token', async () => {
        const res = await request(app).delete(`${API}/account`);
        expect(res.statusCode).toEqual(401);
    });

    it('should reject account deletion without a password', async () => {
        const res = await request(app)
            .delete(`${API}/account`)
            .set('Authorization', `Bearer ${token}`)
            .send({});

        expect(res.statusCode).toEqual(400);
    });

    it('should reject account deletion with a wrong password', async () => {
        const res = await request(app)
            .delete(`${API}/account`)
            .set('Authorization', `Bearer ${token}`)
            .send({ password: 'WrongPassword' });

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'Invalid password');

        // Yanlış deneme hesabı silmemeli
        const stillThere = await db.query('SELECT id FROM users WHERE email = $1', [testUser.email]);
        expect(stillThere.rows.length).toEqual(1);
    });

    it('should delete the account and cascade its data', async () => {
        const user = await db.query('SELECT id FROM users WHERE email = $1', [testUser.email]);

        // Cascade'i gerçekten sına: silmeden önce bir görev ekle
        await db.query(
            'INSERT INTO tasks (user_id, title, priority, energy_level, estimated_minutes, category) VALUES ($1, $2, $3, $4, $5, $6)',
            [user.rows[0].id, 'Cascade test task', 'medium', 'medium', 30, 'work']
        );

        const res = await request(app)
            .delete(`${API}/account`)
            .set('Authorization', `Bearer ${token}`)
            .send({ password: testUser.password });

        expect(res.statusCode).toEqual(200);

        const users = await db.query('SELECT id FROM users WHERE email = $1', [testUser.email]);
        expect(users.rows.length).toEqual(0);

        const tasks = await db.query('SELECT id FROM tasks WHERE user_id = $1', [user.rows[0].id]);
        expect(tasks.rows.length).toEqual(0);
    });

    it('should not allow login after deletion', async () => {
        const res = await request(app)
            .post(`${API}/login`)
            .send({ email: testUser.email, password: testUser.password });

        expect(res.statusCode).toEqual(401);
    });
});
