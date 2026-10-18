#!/usr/bin/env node
// web/*.html dosyalarını backend/legal-content.js'teki kanonik içerikten üretir.
//
//   node scripts/sync-legal.js          → dosyaları yazar
//   node scripts/sync-legal.js --check  → fark varsa çıkış kodu 1 (CI için)
//
// Amaç: gizlilik politikası / kullanım koşulları metinlerinin iki kopya hâlinde
// birbirinden ayrışmasını (2026-10'da yaşandığı gibi) engellemek.

const fs = require('fs');
const path = require('path');
const { pages } = require('../backend/legal-content');

const OUT_DIR = path.join(__dirname, '..', 'web');
const checkOnly = process.argv.includes('--check');

const HEADER = (source) => `<!-- ÜRETİLMİŞ DOSYA — elle düzenlemeyin.
     Kaynak: backend/legal-content.js
     Güncellemek için: npm run legal:sync
     Bu dosya, hukuki sayfaları backend'den bağımsız bir statik host'ta
     (örn. GitHub Pages) yayınlamak istendiğinde kullanılır.
     Kanonik/kullanılan sürüm backend'in servis ettiği: ${source} -->\n`;

const TARGETS = [
    { file: 'privacy-policy.html', body: pages.privacy, route: '/privacy' },
    { file: 'terms-of-service.html', body: pages.terms, route: '/terms' },
    { file: 'support.html', body: pages.support, route: '/support' },
];

let drifted = 0;

for (const { file, body, route } of TARGETS) {
    const target = path.join(OUT_DIR, file);
    const content = HEADER(route) + body + '\n';
    const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null;

    if (current === content) {
        console.log(`✓ ${file} güncel`);
        continue;
    }

    if (checkOnly) {
        drifted++;
        console.error(`✗ ${file} ${current === null ? 'yok' : 'kanonik içerikten farklı'}`);
        continue;
    }

    fs.writeFileSync(target, content, 'utf8');
    console.log(`${current === null ? '+' : '~'} ${file} yazıldı`);
}

if (checkOnly && drifted > 0) {
    console.error(`\n${drifted} dosya kanonik içerikle eşleşmiyor. Çalıştırın: npm run legal:sync`);
    process.exit(1);
}

if (!checkOnly) {
    console.log('\nweb/ kopyaları backend/legal-content.js ile eşitlendi.');
}
