const express = require('express');
const db = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

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

        if (!title) {
            return res.status(400).json({ message: 'Title required' });
        }

        const result = await db.query(
            `INSERT INTO tasks (user_id, title, description, category, priority, energy_level, estimated_minutes, due_date, scheduled_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
            [req.user.id, title, description, category || 'general', priority || 'medium', energy_level || 'medium', estimated_minutes || 30, due_date, scheduled_time]
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

        // Build dynamic update query
        const fields = Object.keys(updates);
        const values = Object.values(updates);

        if (fields.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
        values.push(id, req.user.id);

        const result = await db.query(
            `UPDATE tasks SET ${setClause}, updated_at = NOW() 
       WHERE id = $${values.length - 1} AND user_id = $${values.length}
       RETURNING *`,
            values
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
