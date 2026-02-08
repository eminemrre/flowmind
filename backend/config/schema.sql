-- FlowMind Database Schema
-- PostgreSQL

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    last_active_at TIMESTAMP DEFAULT NOW(),
    current_streak INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1
);

-- User preferences
CREATE TABLE IF NOT EXISTS user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    chronotype VARCHAR(20) DEFAULT 'intermediate', -- morning, evening, intermediate
    wake_time TIME DEFAULT '07:00',
    sleep_time TIME DEFAULT '23:00',
    peak_start TIME DEFAULT '09:00',
    peak_end TIME DEFAULT '12:00',
    work_hours_per_day INTEGER DEFAULT 8,
    health_connected BOOLEAN DEFAULT FALSE,
    notification_daily_plan BOOLEAN DEFAULT TRUE,
    notification_breaks BOOLEAN DEFAULT TRUE,
    notification_achievements BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id)
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'general',
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
    energy_level VARCHAR(20) DEFAULT 'medium', -- low, medium, high
    estimated_minutes INTEGER DEFAULT 30,
    due_date DATE,
    scheduled_time TIMESTAMP,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Focus sessions table
CREATE TABLE IF NOT EXISTS focus_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    task_id INTEGER REFERENCES tasks(id) ON DELETE SET NULL,
    duration_minutes INTEGER DEFAULT 25,
    breaks_taken INTEGER DEFAULT 0,
    started_at TIMESTAMP DEFAULT NOW(),
    ended_at TIMESTAMP,
    completed BOOLEAN DEFAULT FALSE
);

-- Energy logs table
CREATE TABLE IF NOT EXISTS energy_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
    logged_at TIMESTAMP DEFAULT NOW(),
    source VARCHAR(20) DEFAULT 'manual' -- manual, health_kit, predicted
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    achievement_type VARCHAR(50) NOT NULL,
    earned_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, achievement_type)
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    plan_type VARCHAR(20) DEFAULT 'free', -- free, pro_monthly, pro_yearly, lifetime
    started_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(is_completed);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_id ON focus_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_started_at ON focus_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_energy_logs_user_id ON energy_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_energy_logs_logged_at ON energy_logs(logged_at);
