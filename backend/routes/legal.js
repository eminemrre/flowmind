const express = require('express');
const { pages } = require('../legal-content');

const router = express.Router();

// Hukuki sayfalar — içerik `backend/legal-content.js` içinde (kanonik kaynak).
// App Store incelemesinde bu URL'ler açılır: /privacy, /terms, /support
router.get('/privacy', (req, res) => {
    res.type('html').send(pages.privacy);
});

router.get('/terms', (req, res) => {
    res.type('html').send(pages.terms);
});

router.get('/support', (req, res) => {
    res.type('html').send(pages.support);
});

module.exports = router;
