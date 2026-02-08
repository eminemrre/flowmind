const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res, next) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }

        // Check if user exists
        const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const result = await db.query(
            `INSERT INTO users (email, password, name, created_at, last_active_at, current_streak, total_xp, level)
       VALUES ($1, $2, $3, NOW(), NOW(), 0, 0, 1)
       RETURNING id, email, name, created_at, current_streak, total_xp, level`,
            [email, hashedPassword, name || null]
        );

        const user = result.rows[0];
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.status(201).json({ user, token });
    } catch (error) {
        next(error);
    }
});

// Login
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }

        const result = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Update last active
        await db.query('UPDATE users SET last_active_at = NOW() WHERE id = $1', [user.id]);

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        delete user.password;
        res.json({ user, token });
    } catch (error) {
        next(error);
    }
});

// Get current user
router.get('/me', auth, async (req, res, next) => {
    try {
        const result = await db.query(
            `SELECT id, email, name, avatar_url, created_at, last_active_at, current_streak, total_xp, level
       FROM users WHERE id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Logout (client-side token removal, just update last_active)
router.post('/logout', auth, async (req, res) => {
    await db.query('UPDATE users SET last_active_at = NOW() WHERE id = $1', [req.user.id]);
    res.json({ message: 'Logged out' });
});

module.exports = router;
