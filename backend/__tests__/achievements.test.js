const request = require('supertest');
const app = require('../server');
const db = require('../config/database');

// ⚠️ İki hata 2026-10-18'de düzeltildi:
//   1. Yollar `/api` ön ekini içermiyordu → tüm istekler 404 dönüyordu.
//   2. `/achievements/my` diye bir rota yok; mevcut rotalar `GET /` ve `POST /check`.
//      Temizlikte kullanılan `user_achievements` tablosu da şemada yok (doğrusu `achievements`).
const API = '/api/achievements';

describe('Achievements Endpoints', () => {
    let token;
    let userId;
    const testUser = {
        email: 'achievementtest@example.com',
        password: 'Password123!',
        name: 'Achievement Tester',
    };

    beforeAll(async () => {
        // Cleanup
        await db.query('DELETE FROM users WHERE email = $1', [testUser.email]);

        // Register user
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        token = res.body.token;
        userId = res.body.user.id;
    });

    afterAll(async () => {
        // `achievements` satırları users silinince cascade ile gider
        await db.query('DELETE FROM users WHERE id = $1', [userId]);
        await db.pool.end();
    });

    it('should list all achievement definitions with earned flags', async () => {
        const res = await request(app)
            .get(API)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('achievement_type');
        expect(res.body[0]).toHaveProperty('earned', false);
    });

    it('should require authentication', async () => {
        const res = await request(app).get(API);
        expect(res.statusCode).toEqual(401);
    });

    it('should award first_task after completing a task', async () => {
        const created = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Achievement trigger task' });

        expect(created.statusCode).toEqual(201);

        // Uygulamanın gerçekte kullandığı tamamlama rotası (XP de verir)
        const completed = await request(app)
            .post(`/api/tasks/${created.body.id}/complete`)
            .set('Authorization', `Bearer ${token}`);

        expect(completed.statusCode).toEqual(200);
        expect(completed.body.is_completed).toBe(true);

        const res = await request(app)
            .post(`${API}/check`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body.new_achievements)).toBeTruthy();
        expect(res.body.count).toBeGreaterThanOrEqual(1);
        expect(res.body.new_achievements.map(a => a.achievement_type)).toContain('first_task');

        // Kazanılan başarım veritabanına yazılmalı
        const earned = await db.query(
            'SELECT achievement_type FROM achievements WHERE user_id = $1',
            [userId]
        );
        expect(earned.rows.map(r => r.achievement_type)).toContain('first_task');

        // İkinci çağrı aynı başarımı tekrar vermemeli
        const again = await request(app)
            .post(`${API}/check`)
            .set('Authorization', `Bearer ${token}`);

        expect(again.body.count).toEqual(0);

        // Listede artık kazanılmış görünmeli
        const list = await request(app)
            .get(API)
            .set('Authorization', `Bearer ${token}`);

        const firstTask = list.body.find(a => a.achievement_type === 'first_task');
        expect(firstTask.earned).toBe(true);
    });
});
