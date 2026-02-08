const express = require('express');
const db = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get stats
router.get('/', auth, async (req, res, next) => {
    try {
        const { period } = req.query; // day, week, month

        let dateFilter = "started_at >= NOW() - INTERVAL '7 days'";
        if (period === 'day') dateFilter = "started_at >= NOW() - INTERVAL '1 day'";
        if (period === 'month') dateFilter = "started_at >= NOW() - INTERVAL '30 days'";

        // Tasks completed
        const tasksResult = await db.query(
            `SELECT COUNT(*) as count FROM tasks 
       WHERE user_id = $1 AND is_completed = true 
       AND completed_at >= NOW() - INTERVAL '${period === 'day' ? '1 day' : period === 'month' ? '30 days' : '7 days'}'`,
            [req.user.id]
        );

        // Focus minutes
        const focusResult = await db.query(
            `SELECT COALESCE(SUM(duration_minutes), 0) as minutes 
       FROM focus_sessions 
       WHERE user_id = $1 AND completed = true AND ${dateFilter}`,
            [req.user.id]
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
