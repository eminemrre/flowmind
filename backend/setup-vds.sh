#!/bin/bash
# FlowMind Backend VDS Kurulum Scripti
# Bu scripti VDS sunucusunda root olarak çalıştırın

echo "🚀 FlowMind Backend Kurulumu Başlıyor..."

# 1. Sistem güncellemesi
echo "📦 Sistem güncelleniyor..."
apt update && apt upgrade -y

# 2. Node.js kurulumu (v20 LTS)
echo "📦 Node.js kurulumu..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 3. PostgreSQL kurulumu
echo "📦 PostgreSQL kurulumu..."
apt install -y postgresql postgresql-contrib

# 4. PostgreSQL başlat
systemctl start postgresql
systemctl enable postgresql

# 5. FlowMind veritabanı oluştur
echo "🗄️ Veritabanı oluşturuluyor..."
sudo -u postgres psql <<EOF
CREATE USER flowmind_user WITH PASSWORD 'CHANGE_ME_STRONG_PASSWORD';
CREATE DATABASE flowmind OWNER flowmind_user;
GRANT ALL PRIVILEGES ON DATABASE flowmind TO flowmind_user;
EOF

# 6. Proje dizini oluştur
echo "📁 Proje dizini oluşturuluyor..."
mkdir -p /var/www/flowmind
cd /var/www/flowmind

# 7. Git clone
echo "📥 Proje indiriliyor..."
git clone https://github.com/eminemre35/flowmind.git .

# 8. Backend kurulumu
echo "📦 Backend bağımlılıkları kuruluyor..."
cd backend
npm install

# 9. .env dosyası oluştur
echo "⚙️ .env yapılandırılıyor..."
cat > .env <<EOF
# Database
DATABASE_URL=postgresql://flowmind_user:CHANGE_ME_STRONG_PASSWORD@localhost:5432/flowmind
DB_HOST=localhost
DB_PORT=5432
DB_NAME=flowmind
DB_USER=flowmind_user
DB_PASSWORD=CHANGE_ME_STRONG_PASSWORD

# JWT
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=production
CORS_ORIGIN=*

# OpenRouter
OPENROUTER_API_KEY=your_openrouter_key_here
EOF

# 10. Veritabanı migration
echo "🗄️ Veritabanı tabloları oluşturuluyor..."
PGPASSWORD='CHANGE_ME_STRONG_PASSWORD' psql -h localhost -U flowmind_user -d flowmind -f config/schema.sql

# 11. PM2 kurulumu ve başlatma
echo "🚀 PM2 ile sunucu başlatılıyor..."
npm install -g pm2
pm2 start server.js --name flowmind-api
pm2 save
pm2 startup

# 12. Firewall ayarları (opsiyonel)
echo "🔒 Firewall ayarları..."
ufw allow 3000/tcp

echo ""
echo "✅ FlowMind Backend Kurulumu Tamamlandı!"
echo ""
echo "📋 Bilgiler:"
echo "   API URL: http://217.60.254.141:3000/api"
echo "   Health Check: http://217.60.254.141:3000/api/health"
echo ""
echo "🔧 PM2 Komutları:"
echo "   pm2 status          - Durumu göster"
echo "   pm2 logs flowmind-api   - Logları göster"
echo "   pm2 restart flowmind-api - Yeniden başlat"
