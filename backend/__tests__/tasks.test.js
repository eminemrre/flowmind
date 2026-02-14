const request = require('supertest');
const app = require('../server');
const db = require('../config/database');
const jwt = require('jsonwebtoken');

describe('Task Endpoints', () => {
    let token;
    let userId;
    const testUser = {
        email: 'tasktest@example.com',
        password: 'Password123!',
        name: 'Task Tester'
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
        // Cleanup
        await db.query('DELETE FROM tasks WHERE user_id = $1', [userId]);
        await db.query('DELETE FROM users WHERE id = $1', [userId]);
        await db.pool.end();
    });

    it('should create a new task', async () => {
        const res = await request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Task',
                description: 'Description',
                priority: 'high',
                category: 'work',
                estimated_duration: 30
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe('Test Task');
    });

    it('should get all tasks', async () => {
        const res = await request(app)
            .get('/tasks')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should update a task', async () => {
        // First create a task
        const createRes = await request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Task to Update' });

        const taskId = createRes.body.id;

        const res = await request(app)
            .patch(`/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ is_completed: true });

        expect(res.statusCode).toEqual(200);
        expect(res.body.is_completed).toBe(true);
    });

    it('should delete a task', async () => {
        // First create a task
        const createRes = await request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Task to Delete' });

        const taskId = createRes.body.id;

        const res = await request(app)
            .delete(`/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
    });
});
