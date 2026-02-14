const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Log directory
const LOG_DIR = process.env.LOG_DIR || path.join(__dirname, '..', 'logs');

if (!fs.existsSync(LOG_DIR)) {
    try {
        fs.mkdirSync(LOG_DIR, { recursive: true });
    } catch (error) {
        console.error('Failed to create log directory:', error);
    }
}

// Log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Colors for console
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

winston.addColors(colors);

// Formatters
const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);

const fileFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
);

// Transports
const transports = [
    new winston.transports.Console({
        format: consoleFormat,
    }),
    new winston.transports.File({
        filename: path.join(LOG_DIR, 'error.log'),
        level: 'error',
        format: fileFormat,
    }),
    new winston.transports.File({
        filename: path.join(LOG_DIR, 'all.log'),
        format: fileFormat,
    }),
];

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    levels,
    transports,
});

// Stream for Morgan (if used later)
logger.stream = {
    write: (message) => logger.http(message.trim()),
};

module.exports = logger;
