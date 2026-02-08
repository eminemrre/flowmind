const express = require('express');
const db = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Log energy
router.post('/', auth, async (req, res, next) => {
    try {
        const { level } = req.body;

        if (!level || level < 1 || level > 5) {
            return res.status(400).json({ message: 'Level must be between 1 and 5' });
        }

        const result = await db.query(
            `INSERT INTO energy_logs (user_id, energy_level, logged_at, source)
       VALUES ($1, $2, NOW(), 'manual')
       RETURNING *`,
            [req.user.id, level]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Get energy history
router.get('/history', auth, async (req, res, next) => {
    try {
        const { days } = req.query;
        const daysNum = parseInt(days) || 7;

        const result = await db.query(
            `SELECT DATE(logged_at) as date, AVG(energy_level) as avg_level
       FROM energy_logs
       WHERE user_id = $1 AND logged_at >= NOW() - INTERVAL '${daysNum} days'
       GROUP BY DATE(logged_at)
       ORDER BY date DESC`,
            [req.user.id]
        );

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
