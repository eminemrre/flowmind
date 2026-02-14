const express = require('express');
const db = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Allowed fields for task updates (whitelist)
const ALLOWED_UPDATE_FIELDS = [
    'title', 'description', 'category', 'priority',
    'energy_level', 'estimated_minutes', 'due_date',
    'scheduled_time', 'is_completed',
];

// Get all tasks
router.get('/', auth, async (req, res, next) => {
    try {
        const result = await db.query(
            `SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

// Create task
router.post('/', auth, async (req, res, next) => {
    try {
        const { title, description, category, priority, energy_level, estimated_minutes, due_date, scheduled_time } = req.body;

        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            return res.status(400).json({ message: 'Title required' });
        }

        if (title.length > 500) {
            return res.status(400).json({ message: 'Title too long (max 500 chars)' });
        }

        const validPriorities = ['low', 'medium', 'high', 'urgent'];
        const validEnergy = ['low', 'medium', 'high'];

        const safePriority = validPriorities.includes(priority) ? priority : 'medium';
        const safeEnergy = validEnergy.includes(energy_level) ? energy_level : 'medium';
        const safeMinutes = Math.min(Math.max(parseInt(estimated_minutes) || 30, 1), 480);

        const result = await db.query(
            `INSERT INTO tasks (user_id, title, description, category, priority, energy_level, estimated_minutes, due_date, scheduled_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
            [req.user.id, title.trim(), description || null, category || 'general', safePriority, safeEnergy, safeMinutes, due_date || null, scheduled_time || null]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Update task
router.patch('/:id', auth, async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Filter to only allowed fields (whitelist)
        const safeFields = Object.keys(updates).filter(f => ALLOWED_UPDATE_FIELDS.includes(f));
        const safeValues = safeFields.map(f => updates[f]);

        if (safeFields.length === 0) {
            return res.status(400).json({ message: 'No valid fields to update' });
        }

        const setClause = safeFields.map((f, i) => `${f} = $${i + 1}`).join(', ');
        safeValues.push(id, req.user.id);

        const result = await db.query(
            `UPDATE tasks SET ${setClause}, updated_at = NOW() 
       WHERE id = $${safeValues.length - 1} AND user_id = $${safeValues.length}
       RETURNING *`,
            safeValues
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Delete task
router.delete('/:id', auth, async (req, res, next) => {
    try {
        const result = await db.query(
            'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
            [req.params.id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted' });
    } catch (error) {
        next(error);
    }
});

// Complete task
router.post('/:id/complete', auth, async (req, res, next) => {
    try {
        const result = await db.query(
            `UPDATE tasks SET is_completed = true, completed_at = NOW(), updated_at = NOW()
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
            [req.params.id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Add XP to user
        await db.query(
            'UPDATE users SET total_xp = total_xp + 10 WHERE id = $1',
            [req.user.id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
