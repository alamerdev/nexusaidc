// Check authentication
if (!localStorage.getItem('discord_token')) {
  window.location.href = 'index.html';
}

let currentServerId = null;

// Load servers on page load
async function loadServers() {
  const data = await api.getServers();
  const serversList = document.getElementById('serversList');
  
  if (!data.servers || data.servers.length === 0) {
    serversList.innerHTML = '<p style="color: var(--text-dim);">Keine Server gefunden</p>';
    return;
  }

  serversList.innerHTML = data.servers.map(server => `
    <div class="server-item" onclick="selectServer('${server.id}', '${server.name}')">
      ${server.name}
    </div>
  `).join('');

  // Load first server by default
  if (data.servers.length > 0) {
    selectServer(data.servers[0].id, data.servers[0].name);
  }
}

async function selectServer(serverId, serverName) {
  currentServerId = serverId;
  
  // Update UI
  document.querySelectorAll('.server-item').forEach(item => {
    item.classList.remove('active');
  });
  event.target.classList.add('active');

  // Load settings
  const settings = await api.getSettings(serverId);
  displaySettings(serverId, serverName, settings);
}

function displaySettings(serverId, serverName, settings) {
  const content = document.getElementById('dashboardContent');
  
  content.innerHTML = `
    <h2>${serverName}</h2>
    <div class="settings-grid">
      <div class="setting-card">
        <h3>🌍 Sprache</h3>
        <label>Wähle die Sprache</label>
        <select id="language" onchange="updateSetting('language', this.value)">
          <option value="de" ${settings.language === 'de' ? 'selected' : ''}>Deutsch</option>
          <option value="en" ${settings.language === 'en' ? 'selected' : ''}>English</option>
          <option value="fr" ${settings.language === 'fr' ? 'selected' : ''}>Français</option>
        </select>
      </div>

      <div class="setting-card">
        <h3>🤖 Persönlichkeit</h3>
        <label>Beschreibe die AI-Persönlichkeit</label>
        <textarea id="personality" rows="4" placeholder="z.B. Du bist ein freundlicher KI-Assistent...">${settings.personality || ''}</textarea>
        <button class="btn btn-primary save-btn" onclick="saveSetting('personality', document.getElementById('personality').value)">💾 Speichern</button>
      </div>

      <div class="setting-card">
        <h3>💬 AI Channel</h3>
        <label>Kanal für automatische Antworten</label>
        <input type="text" id="aiChannel" value="${settings.aiChannel || ''}" placeholder="Channel ID">
        <button class="btn btn-primary save-btn" onclick="saveSetting('aiChannel', document.getElementById('aiChannel').value)">💾 Speichern</button>
      </div>

      <div class="setting-card">
        <h3>⚙️ Auto-Reply</h3>
        <label>
          <input type="checkbox" ${settings.autoReply ? 'checked' : ''} onchange="updateSetting('autoReply', this.checked)">
          Automatische Antworten aktivieren
        </label>
      </div>
    </div>
  `;
}

async function updateSetting(key, value) {
  const settings = await api.getSettings(currentServerId);
  settings[key] = value;
  await api.saveSettings(currentServerId, settings);
  console.log(`✅ ${key} aktualisiert`);
}

async function saveSetting(key, value) {
  const settings = await api.getSettings(currentServerId);
  settings[key] = value;
  await api.saveSettings(currentServerId, settings);
  alert(`✅ ${key} gespeichert!`);
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('discord_token');
  localStorage.removeItem('discord_userId');
  window.location.href = 'index.html';
});

// Load on startup
loadServers();
