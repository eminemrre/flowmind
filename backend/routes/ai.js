const express = require('express');
const { auth } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = process.env.OPENROUTER_MODEL || 'google/gemma-3-4b-it:free';

// POST /api/ai/chat — OpenRouter proxy. Anahtar YALNIZ sunucuda; istemciye gömülmez.
router.post('/chat', auth, async (req, res, next) => {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            return res.status(503).json({ message: 'AI servisi yapılandırılmamış' });
        }

        const { messages, max_tokens = 500, temperature = 0.7 } = req.body;
        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ message: 'messages gerekli' });
        }

        const response = await fetch(OPENROUTER_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://flowmind.app',
                'X-Title': 'FlowMind AI',
            },
            body: JSON.stringify({ model: MODEL, messages, max_tokens, temperature }),
        });

        if (!response.ok) {
            const txt = await response.text().catch(() => '');
            logger.warn(`OpenRouter error ${response.status}: ${txt.slice(0, 200)}`);
            return res.status(502).json({ message: 'AI sağlayıcı hatası' });
        }

        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content || '';
        res.json({ content });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
