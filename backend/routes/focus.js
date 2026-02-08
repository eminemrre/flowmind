const express = require('express');
const db = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Start focus session
router.post('/', auth, async (req, res, next) => {
    try {
        const { task_id, duration_minutes } = req.body;

        const result = await db.query(
            `INSERT INTO focus_sessions (user_id, task_id, duration_minutes, started_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
            [req.user.id, task_id || null, duration_minutes || 25]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// End focus session
router.post('/:id/end', auth, async (req, res, next) => {
    try {
        const { completed } = req.body;

        const result = await db.query(
            `UPDATE focus_sessions SET ended_at = NOW(), completed = $1
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
            [completed || false, req.params.id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Add XP if completed
        if (completed) {
            await db.query(
                'UPDATE users SET total_xp = total_xp + 25 WHERE id = $1',
                [req.user.id]
            );
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Get focus sessions
router.get('/', auth, async (req, res, next) => {
    try {
        const { start_date, end_date } = req.query;

        let query = 'SELECT * FROM focus_sessions WHERE user_id = $1';
        const params = [req.user.id];

        if (start_date) {
            params.push(start_date);
            query += ` AND started_at >= $${params.length}`;
        }
        if (end_date) {
            params.push(end_date);
            query += ` AND started_at <= $${params.length}`;
        }

        query += ' ORDER BY started_at DESC LIMIT 100';

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
