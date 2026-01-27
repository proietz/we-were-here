// server.js - we-were-here Backend
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
const db = new Database('./wewerehere.db');

// Init DB
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

// Acquisto cella (pagamento simulato, integra Stripe se vuoi)
app.post('/api/buyCell', async (req, res) => {
const { cellId, text, image, link, color, token } = req.body;

const row = db.prepare('SELECT * FROM cells WHERE cellId = ?').get(cellId);
if (row) return res.json({ success: false, message: 'Cella già occupata' });

// Qui puoi integrare Stripe PaymentIntent se vuoi
// const payment = await stripe.paymentIntents.create({ ... });

db.prepare(
'INSERT INTO cells (cellId, text, image, link, color) VALUES (?, ?, ?, ?, ?)'
).run(cellId, text, image, link, color);

res.json({ success: true });
});

// Carica tutte le celle
app.get('/api/loadCells', (req, res) => {
const rows = db.prepare('SELECT * FROM cells').all();
res.json(rows);
});

// Avvio server
app.listen(PORT, () => {
console.log(`Pixel Kingdom backend avviato su http://localhost:${PORT}`);
});