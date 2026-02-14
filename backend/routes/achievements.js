const express = require('express');
const db = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Başarım tanımları
const ACHIEVEMENTS = {
    first_task: {
        title: 'İlk Adım',
        description: 'İlk görevini tamamla',
        emoji: '🎯',
        xp: 50,
    },
    streak_7: {
        title: 'Haftalık Savaşçı',
        description: '7 gün üst üste görev tamamla',
        emoji: '🔥',
        xp: 100,
    },
    streak_30: {
        title: 'Aylık Efsane',
        description: '30 gün üst üste görev tamamla',
        emoji: '🏆',
        xp: 500,
    },
    focus_master: {
        title: 'Odak Ustası',
        description: '10 odaklanma oturumu tamamla',
        emoji: '🧘',
        xp: 150,
    },
    early_bird: {
        title: 'Erken Kuş',
        description: 'Sabah 7\'den önce görev tamamla',
        emoji: '🌅',
        xp: 75,
    },
    night_owl: {
        title: 'Gece Kuşu',
        description: 'Gece 23\'ten sonra görev tamamla',
        emoji: '🦉',
        xp: 75,
    },
    level_5: {
        title: 'Çırak',
        description: 'Level 5\'e ulaş',
        emoji: '⭐',
        xp: 200,
    },
    level_10: {
        title: 'Usta',
        description: 'Level 10\'a ulaş',
        emoji: '💎',
        xp: 500,
    },
};

// Kullanıcının başarımlarını getir
router.get('/', auth, async (req, res, next) => {
    try {
        const result = await db.query(
            'SELECT * FROM achievements WHERE user_id = $1 ORDER BY earned_at DESC',
            [req.user.id]
        );

        // Her başarımın detaylarını ekle
        const achievements = result.rows.map(row => ({
            ...row,
            ...ACHIEVEMENTS[row.achievement_type],
        }));

        // Kazanılmamış başarımları da ekle (kilitsiz göster)
        const earnedTypes = result.rows.map(r => r.achievement_type);
        const allAchievements = Object.entries(ACHIEVEMENTS).map(([type, details]) => ({
            achievement_type: type,
            ...details,
            earned: earnedTypes.includes(type),
            earned_at: result.rows.find(r => r.achievement_type === type)?.earned_at || null,
        }));

        res.json(allAchievements);
    } catch (error) {
        next(error);
    }
});

// Başarım kontrolü ve otomatik verme
router.post('/check', auth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const newAchievements = [];

        // Zaten kazanılmış başarımları al
        const earned = await db.query(
            'SELECT achievement_type FROM achievements WHERE user_id = $1',
            [userId]
        );
        const earnedTypes = earned.rows.map(r => r.achievement_type);

        // 1. İlk görev kontrolü
        if (!earnedTypes.includes('first_task')) {
            const tasks = await db.query(
                'SELECT COUNT(*) as count FROM tasks WHERE user_id = $1 AND is_completed = true',
                [userId]
            );
            if (parseInt(tasks.rows[0].count) >= 1) {
                newAchievements.push('first_task');
            }
        }

        // 2. Streak kontrolü (7 gün)
        if (!earnedTypes.includes('streak_7')) {
            const user = await db.query('SELECT current_streak FROM users WHERE id = $1', [userId]);
            if (user.rows[0]?.current_streak >= 7) {
                newAchievements.push('streak_7');
            }
        }

        // 3. Streak kontrolü (30 gün)
        if (!earnedTypes.includes('streak_30')) {
            const user = await db.query('SELECT current_streak FROM users WHERE id = $1', [userId]);
            if (user.rows[0]?.current_streak >= 30) {
                newAchievements.push('streak_30');
            }
        }

        // 4. Focus Master (10 oturum)
        if (!earnedTypes.includes('focus_master')) {
            const sessions = await db.query(
                'SELECT COUNT(*) as count FROM focus_sessions WHERE user_id = $1 AND completed = true',
                [userId]
            );
            if (parseInt(sessions.rows[0].count) >= 10) {
                newAchievements.push('focus_master');
            }
        }

        // 5. Level kontrolü
        if (!earnedTypes.includes('level_5')) {
            const user = await db.query('SELECT level FROM users WHERE id = $1', [userId]);
            if (user.rows[0]?.level >= 5) {
                newAchievements.push('level_5');
            }
        }

        if (!earnedTypes.includes('level_10')) {
            const user = await db.query('SELECT level FROM users WHERE id = $1', [userId]);
            if (user.rows[0]?.level >= 10) {
                newAchievements.push('level_10');
            }
        }

        // Yeni başarımları kaydet
        for (const type of newAchievements) {
            await db.query(
                'INSERT INTO achievements (user_id, achievement_type, earned_at) VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING',
                [userId, type]
            );

            // XP ver
            const xp = ACHIEVEMENTS[type]?.xp || 0;
            if (xp > 0) {
                await db.query('UPDATE users SET total_xp = total_xp + $1 WHERE id = $2', [xp, userId]);
            }
        }

        // Level güncelle (her 100 XP = 1 level)
        await db.query(
            'UPDATE users SET level = GREATEST(1, total_xp / 100) WHERE id = $1',
            [userId]
        );

        res.json({
            new_achievements: newAchievements.map(type => ({
                achievement_type: type,
                ...ACHIEVEMENTS[type],
            })),
            count: newAchievements.length,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
