# FlowMind Backend API

VDS sunucusunda çalışacak Express.js backend.

## Kurulum

```bash
# Bağımlılıkları kur
npm install

# .env dosyasını oluştur
cp .env.example .env
# .env'i düzenle

# Sunucuyu başlat
npm run dev
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Kayıt
- `POST /api/auth/login` - Giriş
- `GET /api/auth/me` - Kullanıcı bilgisi

### Tasks
- `GET /api/tasks` - Görev listesi
- `POST /api/tasks` - Görev oluştur
- `PATCH /api/tasks/:id` - Güncelle
- `DELETE /api/tasks/:id` - Sil

### Focus Sessions
- `POST /api/focus-sessions` - Başlat
- `POST /api/focus-sessions/:id/end` - Bitir

### Stats
- `GET /api/stats` - İstatistikler

## Veritabanı

PostgreSQL kullanılıyor. Migration için:
```bash
npm run migrate
```
