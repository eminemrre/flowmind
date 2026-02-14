const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const auth = require('../middleware/auth');

// POST /api/tasks/:id/recurrence — Set recurring schedule for a task
router.post('/:id/recurrence', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { recurrence, recurrence_end_date } = req.body;

        const validRecurrences = ['none', 'daily', 'weekdays', 'weekly', 'monthly'];
        if (!validRecurrences.includes(recurrence)) {
            return res.status(400).json({ error: 'Geçersiz tekrar tipi' });
        }

        // Check task belongs to user
        const task = await pool.query(
            'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
            [id, req.userId]
        );
        if (task.rows.length === 0) {
            return res.status(404).json({ error: 'Görev bulunamadı' });
        }

        // Update recurrence fields
        const result = await pool.query(
            `UPDATE tasks SET recurrence = $1, recurrence_end_date = $2, updated_at = NOW() 
             WHERE id = $3 AND user_id = $4 RETURNING *`,
            [recurrence, recurrence_end_date || null, id, req.userId]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Recurrence error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// POST /api/tasks/generate-recurring — Generate today's recurring tasks
router.post('/generate-recurring', auth, async (req, res) => {
    try {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0=Sun...6=Sat
        const dayOfMonth = today.getDate();

        // Find all active recurring tasks for this user
        const recurring = await pool.query(
            `SELECT * FROM tasks WHERE user_id = $1 
             AND recurrence IS NOT NULL AND recurrence != 'none'
             AND is_completed = false
             AND (recurrence_end_date IS NULL OR recurrence_end_date >= CURRENT_DATE)`,
            [req.userId]
        );

        const generated = [];

        for (const task of recurring.rows) {
            let shouldGenerate = false;

            switch (task.recurrence) {
                case 'daily':
                    shouldGenerate = true;
                    break;
                case 'weekdays':
                    shouldGenerate = dayOfWeek >= 1 && dayOfWeek <= 5;
                    break;
                case 'weekly':
                    // Same day of the week as original
                    const originalDay = new Date(task.created_at).getDay();
                    shouldGenerate = dayOfWeek === originalDay;
                    break;
                case 'monthly':
                    const originalDate = new Date(task.created_at).getDate();
                    shouldGenerate = dayOfMonth === originalDate;
                    break;
            }

            if (shouldGenerate) {
                // Check if already generated today
                const existing = await pool.query(
                    `SELECT id FROM tasks WHERE parent_task_id = $1 
                     AND DATE(created_at) = CURRENT_DATE`,
                    [task.id]
                );

                if (existing.rows.length === 0) {
                    const newTask = await pool.query(
                        `INSERT INTO tasks (user_id, title, description, category, priority, 
                         energy_level, estimated_minutes, due_date, parent_task_id)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE, $8) RETURNING *`,
                        [
                            req.userId, task.title, task.description, task.category,
                            task.priority, task.energy_level, task.estimated_minutes, task.id
                        ]
                    );
                    generated.push(newTask.rows[0]);
                }
            }
        }

        res.json({ message: `${generated.length} tekrarlayan görev oluşturuldu`, tasks: generated });
    } catch (error) {
        console.error('Generate recurring error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

module.exports = router;
