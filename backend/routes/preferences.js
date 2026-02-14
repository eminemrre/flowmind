const express = require('express');
const db = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get preferences
router.get('/', auth, async (req, res, next) => {
    try {
        const result = await db.query(
            'SELECT * FROM user_preferences WHERE user_id = $1',
            [req.user.id]
        );

        if (result.rows.length === 0) {
            // Create default preferences
            const defaultResult = await db.query(
                `INSERT INTO user_preferences (user_id) VALUES ($1) RETURNING *`,
                [req.user.id]
            );
            return res.json(defaultResult.rows[0]);
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Update preferences
router.patch('/', auth, async (req, res, next) => {
    try {
        const allowedFields = [
            'chronotype', 'wake_time', 'sleep_time',
            'peak_start', 'peak_end', 'work_hours_per_day',
            'health_connected', 'notification_daily_plan',
            'notification_breaks', 'notification_achievements',
        ];

        const updates = req.body;
        const safeFields = Object.keys(updates).filter(f => allowedFields.includes(f));
        const safeValues = safeFields.map(f => updates[f]);

        if (safeFields.length === 0) {
            return res.status(400).json({ message: 'No valid fields to update' });
        }

        // Upsert: create if not exists, update if exists
        const existing = await db.query(
            'SELECT id FROM user_preferences WHERE user_id = $1',
            [req.user.id]
        );

        if (existing.rows.length === 0) {
            await db.query(
                'INSERT INTO user_preferences (user_id) VALUES ($1)',
                [req.user.id]
            );
        }

        const setClause = safeFields.map((f, i) => `${f} = $${i + 1}`).join(', ');
        safeValues.push(req.user.id);

        const result = await db.query(
            `UPDATE user_preferences SET ${setClause} WHERE user_id = $${safeValues.length} RETURNING *`,
            safeValues
        );

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
