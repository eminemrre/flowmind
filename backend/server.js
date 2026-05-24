require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./utils/logger');

// Routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const focusRoutes = require('./routes/focus');
const statsRoutes = require('./routes/stats');
const energyRoutes = require('./routes/energy');
const preferencesRoutes = require('./routes/preferences');
const achievementsRoutes = require('./routes/achievements');
const legalRoutes = require('./routes/legal');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

// Logging Middleware
app.use((req, res, next) => {
    logger.http(`${req.method} ${req.url} - ${req.ip}`);
    next();
});

// Simple in-memory rate limiting (improved logging)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 100; // max requests per window

const rateLimit = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
        return next();
    }

    const entry = rateLimitMap.get(ip);
    if (now > entry.resetTime) {
        entry.count = 1;
        entry.resetTime = now + RATE_LIMIT_WINDOW_MS;
        return next();
    }

    entry.count++;
    if (entry.count > RATE_LIMIT_MAX) {
        logger.warn(`Rate limit exceeded for IP: ${ip}`);
        return res.status(429).json({ message: 'Too many requests. Try again later.' });
    }

    next();
};

app.use('/api', rateLimit);

// Stricter rate limit for auth endpoints
const AUTH_RATE_LIMIT_MAX = 10;
const authRateLimit = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const key = `auth_${ip}`;
    const now = Date.now();

    if (!rateLimitMap.has(key)) {
        rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
        return next();
    }

    const entry = rateLimitMap.get(key);
    if (now > entry.resetTime) {
        entry.count = 1;
        entry.resetTime = now + RATE_LIMIT_WINDOW_MS;
        return next();
    }

    entry.count++;
    if (entry.count > AUTH_RATE_LIMIT_MAX) {
        logger.warn(`Auth rate limit exceeded for IP: ${ip}`);
        return res.status(429).json({ message: 'Too many auth attempts. Try again later.' });
    }

    next();
};

// Clean up rate limit map periodically (every 30 min)
if (process.env.NODE_ENV !== 'test') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of rateLimitMap) {
            if (now > entry.resetTime) {
                rateLimitMap.delete(key);
            }
        }
    }, 30 * 60 * 1000);
}

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRateLimit, authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/focus-sessions', focusRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/energy', energyRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/achievements', achievementsRoutes);

// Legal / Support pages (public, no /api prefix — these are App Store-facing URLs)
app.use('/', legalRoutes);

// Error handling
app.use((err, req, res, next) => {
    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    if (err.stack) logger.debug(err.stack);

    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

// Export app for testing
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
        logger.info(`🚀 FlowMind API running on port ${PORT}`);
    });

    // Graceful Shutdown
    const shutdown = (signal) => {
        logger.info(`${signal} signal received: closing HTTP server`);
        server.close(async () => {
            logger.info('HTTP server closed');
            // If DB connection needs closing, do it here
            // await pool.end();
            process.exit(0);
        });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('uncaughtException', (err) => {
        logger.error('Uncaught Exception:', err);
        process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
        logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
        process.exit(1);
    });
}

module.exports = app;
