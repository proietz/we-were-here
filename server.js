// server.js - We Were Here Backend
// Stack: Node.js + Express + better-sqlite3 + Stripe

const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database
const db = new Database('./we-were-here.db');

// Initialize table if not exists
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

// Buy a cell (payment simulation; Stripe integration possible)
app.post('/api/buyCell', async (req, res) => {
const { cellId, text, image, link, color, token } = req.body;

// Check if cell is already occupied
const row = db.prepare('SELECT * FROM cells WHERE cellId = ?').get(cellId);
if (row) return res.json({ success: false, message: 'Cell already occupied' });

// Optional: integrate Stripe payment here
// const payment = await stripe.paymentIntents.create({ ... });

db.prepare(
'INSERT INTO cells (cellId, text, image, link, color) VALUES (?, ?, ?, ?, ?)'
).run(cellId, text, image, link, color);

res.json({ success: true });
});

// Load all cells
app.get('/api/loadCells', (req, res) => {
const rows = db.prepare('SELECT * FROM cells').all();
res.json(rows);
});

// Start server
app.listen(PORT, () => {
console.log(`We Were Here backend running at http://localhost:${PORT}`);
});