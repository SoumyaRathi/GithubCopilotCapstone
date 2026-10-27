const path = require('node:path');
const { openDb } = require('./db');
const { createApp } = require('./app');

const port = Number(process.env.PORT) || 3000;
const dbFile = process.env.DB_FILE || path.join(__dirname, '..', 'data', 'todo.db');

const app = createApp(openDb(dbFile));
app.listen(port, () => console.log(`KAN-143 ToDo app listening on http://localhost:${port}`));
