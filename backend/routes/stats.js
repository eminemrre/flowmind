const express = require('express');
const db = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Allowed period values (whitelist)
const PERIOD_INTERVALS = {
    day: '1 day',
    week: '7 days',
    month: '30 days',
};

// Get stats
router.get('/', auth, async (req, res, next) => {
    try {
        const { period } = req.query;
        const interval = PERIOD_INTERVALS[period] || PERIOD_INTERVALS.week;

        // Tasks completed - using parameterized interval via make_interval or safe whitelist
        const tasksResult = await db.query(
            `SELECT COUNT(*) as count FROM tasks 
       WHERE user_id = $1 AND is_completed = true 
       AND completed_at >= NOW() - $2::interval`,
            [req.user.id, interval]
        );

        // Focus minutes
        const focusResult = await db.query(
            `SELECT COALESCE(SUM(duration_minutes), 0) as minutes 
       FROM focus_sessions 
       WHERE user_id = $1 AND completed = true AND started_at >= NOW() - $2::interval`,
            [req.user.id, interval]
        );

        // User info
        const userResult = await db.query(
            'SELECT current_streak, total_xp, level FROM users WHERE id = $1',
            [req.user.id]
        );

        res.json({
            tasks_completed: parseInt(tasksResult.rows[0].count),
            focus_minutes: parseInt(focusResult.rows[0].minutes),
            streak: userResult.rows[0]?.current_streak || 0,
            total_xp: userResult.rows[0]?.total_xp || 0,
            level: userResult.rows[0]?.level || 1,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
