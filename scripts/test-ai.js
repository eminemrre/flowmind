const https = require('https');
const fs = require('fs');
const path = require('path');

// Load .env
const envPath = path.join(__dirname, '../.env');
let apiKey = '';
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/EXPO_PUBLIC_OPENROUTER_API_KEY=(.+)/);
    if (match) apiKey = match[1].trim();
} catch (e) {
    console.error('❌ .env dosyası okunamadı:', e.message);
    process.exit(1);
}

if (!apiKey) {
    console.error('❌ API Key bulunamadı!');
    process.exit(1);
}

console.log('🔄 OpenRouter bağlantısı test ediliyor...\n');

const data = JSON.stringify({
    model: 'google/gemma-3-4b-it:free',
    messages: [{ role: 'user', content: 'Say "Connection Successful - Bağlantı Başarılı" in a friendly way.' }]
});

const options = {
    hostname: 'openrouter.ai',
    path: '/api/v1/chat/completions',
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://flowmind.app',
        'X-Title': 'FlowMind AI Test'
    }
};

const req = https.request(options, (res) => {
    let responseData = '';
    res.on('data', (chunk) => { responseData += chunk; });
    res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
                const json = JSON.parse(responseData);
                const content = json.choices[0]?.message?.content;
                console.log('✅ AI Yanıtı:', content);
                console.log('\n✅ OpenRouter bağlantısı BAŞARILI!');
            } catch (e) {
                console.error('❌ Parse hatası:', e.message);
            }
        } else {
            console.error(`❌ API Hatası ${res.statusCode}:`, responseData);
        }
    });
});

req.on('error', (e) => {
    console.error('❌ İstek hatası:', e.message);
});

req.write(data);
req.end();
