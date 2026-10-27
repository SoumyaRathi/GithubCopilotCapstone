const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { openDb } = require('../../src/db');
const { createApp } = require('../../src/app');

// Starts an app on an ephemeral port with its own database. Each call is isolated (DR-5).
async function startServer({ file, now, rateLimit } = {}) {
  const db = openDb(file || ':memory:');
  const app = createApp(db, { now, rateLimit: rateLimit || { max: 10000 } });
  const server = await new Promise((resolve) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  return {
    db,
    base,
    async close() {
      server.closeAllConnections();
      await new Promise((r) => server.close(r));
      db.close();
    },
  };
}

function tempDbFile() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'kan143-'));
  return { file: path.join(dir, 'test.db'), cleanup: () => fs.rmSync(dir, { recursive: true, force: true }) };
}

// Minimal client that keeps the session cookie.
function client(base) {
  let cookie = '';
  async function request(method, url, body) {
    const res = await fetch(base + url, {
      method,
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(cookie ? { Cookie: cookie } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const set = res.headers.get('set-cookie');
    if (set) {
      const pair = set.split(';')[0];
      cookie = pair.endsWith('=') ? '' : pair;
    }
    const text = await res.text();
    return { status: res.status, body: text ? JSON.parse(text) : null, headers: res.headers };
  }
  return {
    request,
    async signUp(username = 'alice', password = 'password123') {
      await request('POST', '/api/auth/register', { username, password });
      return request('POST', '/api/auth/login', { username, password });
    },
  };
}

module.exports = { startServer, tempDbFile, client };
