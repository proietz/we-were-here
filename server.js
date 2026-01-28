const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database (file locale)
const dbPath = path.join(__dirname, 'wewerehere.db');
const db = new Database(dbPath);

// Init table
db.prepare(`
CREATE TABLE IF NOT EXISTS cells (
cellId INTEGER PRIMARY KEY,
text TEXT,
image TEXT,
link TEXT,
color TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`).run();

// Create cell
app.post('/api/buyCell', (req, res) => {
const { cellId, text, image, link, color } = req.body;

if (!cellId) {
return res.status(400).json({ success: false, message: 'Missing cellId' });
}

const existing = db
.prepare('SELECT cellId FROM cells WHERE cellId = ?')
.get(cellId);

if (existing) {
return res.json({ success: false, message: 'Cell already occupied' });
}

db.prepare(`
INSERT INTO cells (cellId, text, image, link, color)
VALUES (?, ?, ?, ?, ?)
`).run(cellId, text, image, link, color);

res.json({ success: true });
});

// Load all cells
app.get('/api/loadCells', (req, res) => {
const cells = db.prepare('SELECT * FROM cells').all();
res.json(cells);
});

// Start server
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});