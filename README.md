# NexusAI Discord Bot 🤖

Ein moderner Discord Bot mit künstlicher Intelligenz, Web-Dashboard und Echtzeit-Synchronisierung.

## 🚀 Features

- **Intelligente KI**: Groq API Integration für schnelle, kontextbasierte Antworten
- **Web Dashboard**: Modern, responsiv und live synchronisiert
- **Server Management**: Passe Persönlichkeit, Sprache und Einstellungen an
- **Code Generator**: /script Command für Code-Generierung in mehreren Sprachen
- **Sicher**: Discord OAuth2 & Admin-Kontrolle

## 📁 Projektstruktur

```
nexus-ai-project/
├── bot/                 # Discord Bot
│   ├── src/
│   │   ├── commands/    # Deine Slash Commands
│   │   ├── events/      # Event Handler
│   │   └── utils/       # Hilfsfunktionen (Groq, Database)
│   └── package.json
│
├── worker/              # Cloudflare Worker
│   ├── src/
│   │   ├── api/         # API Endpoints
│   │   └── oauth.js     # OAuth2 Handler
│   └── wrangler.toml
│
└── dashboard/           # GitHub Pages
    ├── index.html       # Startseite
    ├── dashboard.html   # Dashboard
    ├── css/
    └── js/
```

## ⚙️ Setup

### 1. Bot Setup

```bash
cd bot
npm install
cp .env.example .env
# Füge deine Tokens in .env ein
npm start
```

**Benötigte Secrets in .env:**
- `DISCORD_TOKEN` - Dein Bot Token von Discord
- `GROQ_API_KEY` - Dein Groq API Key
- `WORKER_URL` - URL deines Cloudflare Workers
- `WORKER_AUTH_TOKEN` - Secret Token für Worker Auth

### 2. Worker Setup

```bash
cd worker
npm install
# Konfiguriere wrangler.toml mit deinen Credentials
npm run deploy
```

**Benötigte Secrets in wrangler.toml:**
- `DISCORD_CLIENT_ID` - Client ID aus Discord Developer Portal
- `DISCORD_CLIENT_SECRET` - Client Secret aus Discord Developer Portal
- Erstelle ein **KV Namespace** namens `NEXUS_KV`

### 3. Dashboard Setup

- Pushe den `dashboard/` Ordner zu GitHub Pages
- Gehe zu: Settings → Pages → Branch: main, Folder: /dashboard
- Aktualisiere `WORKER_URL` in `dashboard/js/api.js`

## 🔑 Umgebungsvariablen

### Bot (.env)
```
DISCORD_TOKEN=your_bot_token
GROQ_API_KEY=your_groq_key
WORKER_URL=https://your-worker.workers.dev
WORKER_AUTH_TOKEN=secret_token
```

### Worker (wrangler.toml)
```toml
DISCORD_CLIENT_ID=your_id
DISCORD_CLIENT_SECRET=your_secret
```

## 📚 API Dokumentation

### `/api/servers`
Holt die Admin-Server des Nutzers
- **Methode**: GET
- **Auth**: Discord OAuth Token
- **Response**: `{ servers: [...] }`

### `/api/settings/{serverId}`
GET/POST für Server-Einstellungen
- **GET**: Hole Server-Konfiguration
- **POST**: Speichere Server-Konfiguration

### `/auth/callback`
OAuth2 Callback für Discord Login

### `/invite`
Redirect zum Discord Bot Invite Link

## 🎮 Deine Commands

- `/ask` - Stelle NexusAI eine Frage
- `/script` - Generiere Code
- `/set_language` - Ändere die Sprache
- `/set_personality` - Ändere die Persönlichkeit
- Und weitere...

## 🛠️ Integrationen

### Groq API (`bot/src/utils/groq.js`)
Für KI-Antworten

### Database (`bot/src/utils/database.js`)
Für Server-Konfiguration (speichert über Worker)

### Discord OAuth2 (`worker/src/oauth.js`)
Für Dashboard-Login

## 📝 Lizenz

MIT

## 👨‍💻 Autor

Alamer (@alamerdev)

---

**Made with ❤️ and AI**
