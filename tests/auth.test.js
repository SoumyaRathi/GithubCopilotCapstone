const test = require('node:test');
const assert = require('node:assert/strict');
const { startServer, client } = require('./helpers/setup');
const { openDb } = require('../src/db');

test('foreign keys are enforced on connections (DR-3)', () => {
  const db = openDb(':memory:');
  assert.equal(db.prepare('PRAGMA foreign_keys').get().foreign_keys, 1);
  assert.throws(() =>
    db.prepare("INSERT INTO tasks (user_id, title, created_at, updated_at) VALUES (999, 't', 'x', 'x')").run()
  );
  db.close();
});

test('register, login, me, logout', async () => {
  const s = await startServer();
  try {
    const c = client(s.base);
    const reg = await c.request('POST', '/api/auth/register', { username: 'alice', password: 'password123' });
    assert.equal(reg.status, 201);
    assert.equal(reg.body.username, 'alice');

    const login = await c.request('POST', '/api/auth/login', { username: 'alice', password: 'password123' });
    assert.equal(login.status, 200);
    const cookie = login.headers.get('set-cookie');
    assert.match(cookie, /HttpOnly/i);
    assert.match(cookie, /SameSite=Strict/i);

    assert.equal((await c.request('GET', '/api/auth/me')).body.username, 'alice');
    assert.equal((await c.request('POST', '/api/auth/logout')).status, 204);
    assert.equal((await c.request('GET', '/api/tasks')).status, 401);
  } finally {
    await s.close();
  }
});

test('duplicate username returns 409 and invalid input 400', async () => {
  const s = await startServer();
  try {
    const c = client(s.base);
    await c.request('POST', '/api/auth/register', { username: 'bob_1', password: 'password123' });
    assert.equal((await c.request('POST', '/api/auth/register', { username: 'bob_1', password: 'password123' })).status, 409);
    assert.equal((await c.request('POST', '/api/auth/register', { username: 'a', password: 'password123' })).status, 400);
    assert.equal((await c.request('POST', '/api/auth/register', { username: 'carol', password: 'short' })).status, 400);
  } finally {
    await s.close();
  }
});

test('bad credentials give the same 401 for unknown user and wrong password', async () => {
  const s = await startServer();
  try {
    const c = client(s.base);
    await c.request('POST', '/api/auth/register', { username: 'alice', password: 'password123' });
    const wrong = await c.request('POST', '/api/auth/login', { username: 'alice', password: 'wrongpass1' });
    const unknown = await c.request('POST', '/api/auth/login', { username: 'nobody', password: 'wrongpass1' });
    assert.equal(wrong.status, 401);
    assert.equal(unknown.status, 401);
    assert.deepEqual(wrong.body, unknown.body);
  } finally {
    await s.close();
  }
});

test('protected endpoints require authentication', async () => {
  const s = await startServer();
  try {
    const c = client(s.base);
    assert.equal((await c.request('GET', '/api/tasks')).status, 401);
    assert.equal((await c.request('POST', '/api/tasks', { title: 'x' })).status, 401);
    assert.equal((await c.request('DELETE', '/api/tasks/1')).status, 401);
  } finally {
    await s.close();
  }
});

test('expired sessions are rejected (DR-2)', async () => {
  let clock = Date.now();
  const s = await startServer({ now: () => clock });
  try {
    const c = client(s.base);
    await c.signUp();
    assert.equal((await c.request('GET', '/api/tasks')).status, 200);
    clock += 7 * 24 * 60 * 60 * 1000 + 1000;
    assert.equal((await c.request('GET', '/api/tasks')).status, 401);
  } finally {
    await s.close();
  }
});

test('auth endpoints are rate limited', async () => {
  const s = await startServer({ rateLimit: { max: 3, windowMs: 60000 } });
  try {
    const c = client(s.base);
    const codes = [];
    for (let i = 0; i < 5; i++) {
      codes.push((await c.request('POST', '/api/auth/login', { username: 'nobody', password: 'wrongpass1' })).status);
    }
    assert.equal(codes[4], 429);
  } finally {
    await s.close();
  }
});

test('oversized bodies and malformed JSON are rejected', async () => {
  const s = await startServer();
  try {
    const big = await fetch(s.base + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'a'.repeat(20000), password: 'x' }),
    });
    assert.equal(big.status, 413);
    const bad = await fetch(s.base + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{not json',
    });
    assert.equal(bad.status, 400);
  } finally {
    await s.close();
  }
});
