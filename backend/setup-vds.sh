#!/bin/bash
# FlowMind Backend VDS Kurulum Scripti
# Bu scripti VDS sunucusunda root olarak çalıştırın.
#
# ⚠️ SIRLARI ASLA BU DOSYAYA YAZMAYIN. Bu depo herkese açıktır.
#    Anahtarlar ortam değişkeni ya da interaktif soru ile alınır.
#
# Kullanım:
#   OPENROUTER_API_KEY=sk-or-... ./setup-vds.sh
# veya anahtar verilmezse script çalışırken sorar.

set -euo pipefail

# CI ile aynı dizin (.github/workflows/ci.yml → /opt/flowmind/backend)
APP_DIR="${APP_DIR:-/opt/flowmind}"
REPO_URL="${REPO_URL:-https://github.com/eminemrre/flowmind.git}"
DB_NAME="${DB_NAME:-flowmind}"
DB_USER="${DB_USER:-flowmind_user}"
API_PORT="${API_PORT:-3000}"

echo "🚀 FlowMind Backend Kurulumu Başlıyor..."
echo "   Dizin: $APP_DIR"

# 1. Sistem güncellemesi
echo "📦 Sistem güncelleniyor..."
apt update && apt upgrade -y

# 2. Node.js kurulumu (v20 LTS)
echo "📦 Node.js kurulumu..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git openssl

# 3. PostgreSQL kurulumu
echo "📦 PostgreSQL kurulumu..."
apt install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql

# 4. Veritabanı — parola rastgele üretilir, ekrana yazılmaz
echo "🗄️ Veritabanı oluşturuluyor..."
DB_PASSWORD="$(openssl rand -base64 24 | tr -d '/+=' | head -c 32)"

sudo -u postgres psql -v ON_ERROR_STOP=1 <<EOF
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${DB_USER}') THEN
    CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';
  ELSE
    ALTER USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';
  END IF;
END
\$\$;
EOF

sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1 \
  || sudo -u postgres createdb -O "${DB_USER}" "${DB_NAME}"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"

# 5. Proje dizini + kod
echo "📁 Proje dizini hazırlanıyor..."
mkdir -p "$APP_DIR"
cd "$APP_DIR"
if [ -d .git ]; then
  git pull origin main
else
  git clone "$REPO_URL" .
fi

# 6. Backend bağımlılıkları
echo "📦 Backend bağımlılıkları kuruluyor..."
cd backend
npm ci --omit=dev

# 7. .env — sırlar ortamdan ya da sorularak alınır
echo "⚙️ .env yapılandırılıyor..."
if [ -z "${OPENROUTER_API_KEY:-}" ]; then
  read -rsp "OpenRouter API anahtarı (girilen değer görünmez): " OPENROUTER_API_KEY
  echo
fi
if [ -z "${OPENROUTER_API_KEY:-}" ]; then
  echo "⚠️  OPENROUTER_API_KEY verilmedi — AI özellikleri 503 dönecek, diğerleri çalışır."
fi

umask 077
cat > .env <<EOF
# Database
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}
DB_HOST=localhost
DB_PORT=5432
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}

# JWT
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=7d

# Server
PORT=${API_PORT}
NODE_ENV=production
CORS_ORIGIN=*

# OpenRouter (yalnız sunucuda; asla repoya commit'lenmez)
OPENROUTER_API_KEY=${OPENROUTER_API_KEY:-}
OPENROUTER_MODEL=${OPENROUTER_MODEL:-google/gemma-3-4b-it:free}
EOF
chmod 600 .env
echo "   .env yazıldı (izinler 600, dizin: $(pwd)/.env)"

# 8. Veritabanı şeması
echo "🗄️ Veritabanı tabloları oluşturuluyor..."
PGPASSWORD="$DB_PASSWORD" psql -h localhost -U "$DB_USER" -d "$DB_NAME" -f config/schema.sql

# 9. PM2
echo "🚀 PM2 ile sunucu başlatılıyor..."
npm install -g pm2
pm2 start server.js --name flowmind-api || pm2 restart flowmind-api
pm2 save
pm2 startup | tail -1

# 10. Firewall
echo "🔒 Firewall ayarları..."
if command -v ufw >/dev/null; then
  ufw allow "${API_PORT}/tcp"
  ufw allow 22/tcp
fi

echo ""
echo "✅ FlowMind Backend kurulumu tamamlandı."
echo ""
echo "   Dizin:        $(pwd)"
echo "   Health check: http://<sunucu-ip>:${API_PORT}/api/health"
echo "   Legal:        /privacy · /terms · /support"
echo ""
echo "🔧 PM2 komutları:"
echo "   pm2 status"
echo "   pm2 logs flowmind-api"
echo "   pm2 restart flowmind-api"
echo ""
echo "⚠️  Açık adres HTTP'dir. Mağaza öncesi TLS sonlandırma (nginx/caddy) ekleyin:"
echo "    legal URL'ler HTTPS olmalıdır."
