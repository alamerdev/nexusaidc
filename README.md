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
│   │   ├── commands/    # Slash Commands
│   │   ├── events/      # Event Handler
│   │   └── utils/       # Hilfsfunktionen
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

### 2. Worker Setup

```bash
cd worker
npm install
# Konfiguriere wrangler.toml mit deinen Credentials
npm run deploy
```

### 3. Dashboard Setup

- Pushe den `dashboard/` Ordner zu GitHub Pages
- Aktualisiere die WORKER_URL in den JavaScript-Dateien

## 🔐 Umgebungsvariablen

### Bot (.env)
```
DISCORD_TOKEN=your_token
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

### /api/servers
Holt die Admin-Server des Nutzers

### /api/settings/{serverId}
GET/POST für Server-Einstellungen

### /auth/callback
OAuth2 Callback für Discord Login

## 🛠️ Commands

- `/ask` - Stelle NexusAI eine Frage
- `/script` - Generiere Code
- `/set_language` - Ändere die Sprache
- `/set_personality` - Ändere die Persönlichkeit
- `/help` - Zeige die Hilfe

## 📝 Lizenz

MIT

## 👨‍💻 Autor

Alamer (@alamerdev)

---

**Made with ❤️ and AI**
