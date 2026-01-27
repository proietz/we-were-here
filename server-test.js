const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
res.send('Server minimale funzionante!');
});

app.listen(PORT, () => {
console.log(`Server-test running at http://localhost:${PORT}`);
});