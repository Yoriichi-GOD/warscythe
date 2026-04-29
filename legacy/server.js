const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, '.'))); // serve the static files

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// User credentials (simple auth for persistent data)
const USERS_FILE = path.join(DATA_DIR, 'users.json');
let users = {};
if (fs.existsSync(USERS_FILE)) {
  users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

function saveUsers() {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });

  const id = username.toLowerCase();
  
  if (users[id]) {
    if (users[id].password !== password) {
      return res.status(401).json({ error: 'Access denied. Incorrect passkey.' });
    }
  } else {
    // Register new user seamlessly setup
    users[id] = { username, password };
    saveUsers();
  }

  // Load state
  const stateFile = path.join(DATA_DIR, `${id}_state.json`);
  let state = null;
  if (fs.existsSync(stateFile)) {
    try {
      state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
    } catch(e) {}
  }

  res.json({ success: true, username, state });
});

app.post('/api/sync', (req, res) => {
  const { username, password, state } = req.body;
  if (!username || !password || !state) return res.status(400).json({ error: 'Bad request' });

  const id = username.toLowerCase();
  
  if (!users[id] || users[id].password !== password) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Save state
  const stateFile = path.join(DATA_DIR, `${id}_state.json`);
  fs.writeFileSync(stateFile, JSON.stringify(state));
  
  res.json({ success: true });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`WARLORD SERVER RUNNING ON http://localhost:${PORT}`);
  console.log(`Command Center Auth System Enabled. Waiting for connections...`);
});
