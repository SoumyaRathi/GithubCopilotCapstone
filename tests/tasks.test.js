const test = require('node:test');
const assert = require('node:assert/strict');
const { startServer, tempDbFile, client } = require('./helpers/setup');

async function withUser(fn) {
  const s = await startServer();
  try {
    const c = client(s.base);
    await c.signUp();
    await fn(c, s);
  } finally {
    await s.close();
  }
}

test('AC-1 create task: valid, pending by default, trimmed title', () =>
  withUser(async (c) => {
    const res = await c.request('POST', '/api/tasks', { title: '  Buy milk  ', description: '2 litres' });
    assert.equal(res.status, 201);
    assert.equal(res.body.title, 'Buy milk');
    assert.equal(res.body.description, '2 litres');
    assert.equal(res.body.completed, false);
    assert.ok(res.body.id);
  }));

test('AC-1 validation: empty/over-long title and long description rejected', () =>
  withUser(async (c) => {
    assert.equal((await c.request('POST', '/api/tasks', { title: '   ' })).status, 400);
    assert.equal((await c.request('POST', '/api/tasks', {})).status, 400);
    assert.equal((await c.request('POST', '/api/tasks', { title: 'x'.repeat(101) })).status, 400);
    assert.equal((await c.request('POST', '/api/tasks', { title: 'ok', description: 'x'.repeat(1001) })).status, 400);
    assert.equal((await c.request('POST', '/api/tasks', { title: 'x'.repeat(100) })).status, 201);
    assert.equal((await c.request('POST', '/api/tasks', { title: 'ok' })).body.description, '');
  }));

test('AC-2 list tasks: newest first, includes completed and pending', () =>
  withUser(async (c) => {
    const a = (await c.request('POST', '/api/tasks', { title: 'first' })).body;
    const b = (await c.request('POST', '/api/tasks', { title: 'second' })).body;
    await c.request('PATCH', `/api/tasks/${a.id}/status`, { completed: true });
    const list = (await c.request('GET', '/api/tasks')).body;
    assert.deepEqual(list.map((t) => t.title), ['second', 'first']);
    assert.equal(list.find((t) => t.id === a.id).completed, true);
    assert.equal(list.find((t) => t.id === b.id).completed, false);
  }));

test('AC-2 empty list returns []', () =>
  withUser(async (c) => {
    assert.deepEqual((await c.request('GET', '/api/tasks')).body, []);
  }));

test('AC-3 edit task and DR-1 description semantics', () =>
  withUser(async (c) => {
    const t = (await c.request('POST', '/api/tasks', { title: 'old', description: 'keep me' })).body;
    const edited = await c.request('PUT', `/api/tasks/${t.id}`, { title: 'new', description: 'changed' });
    assert.equal(edited.status, 200);
    assert.equal(edited.body.title, 'new');
    assert.equal(edited.body.description, 'changed');

    const omitted = await c.request('PUT', `/api/tasks/${t.id}`, { title: 'newer' });
    assert.equal(omitted.body.description, 'changed');

    const cleared = await c.request('PUT', `/api/tasks/${t.id}`, { title: 'newer', description: '' });
    assert.equal(cleared.body.description, '');

    assert.equal((await c.request('PUT', `/api/tasks/${t.id}`, { description: 'no title' })).status, 400);
    assert.equal((await c.request('PUT', `/api/tasks/${t.id}`, { title: '' })).status, 400);
  }));

test('AC-3 editing does not change completion status', () =>
  withUser(async (c) => {
    const t = (await c.request('POST', '/api/tasks', { title: 'x' })).body;
    await c.request('PATCH', `/api/tasks/${t.id}/status`, { completed: true });
    const edited = await c.request('PUT', `/api/tasks/${t.id}`, { title: 'y' });
    assert.equal(edited.body.completed, true);
  }));

test('AC-4 delete task permanently', () =>
  withUser(async (c) => {
    const t = (await c.request('POST', '/api/tasks', { title: 'gone' })).body;
    assert.equal((await c.request('DELETE', `/api/tasks/${t.id}`)).status, 204);
    assert.deepEqual((await c.request('GET', '/api/tasks')).body, []);
    assert.equal((await c.request('DELETE', `/api/tasks/${t.id}`)).status, 404);
  }));

test('AC-5 mark completed and back to pending', () =>
  withUser(async (c) => {
    const t = (await c.request('POST', '/api/tasks', { title: 'x' })).body;
    assert.equal((await c.request('PATCH', `/api/tasks/${t.id}/status`, { completed: true })).body.completed, true);
    assert.equal((await c.request('PATCH', `/api/tasks/${t.id}/status`, { completed: false })).body.completed, false);
    assert.equal((await c.request('PATCH', `/api/tasks/${t.id}/status`, { completed: 'yes' })).status, 400);
  }));

test('invalid and unknown ids', () =>
  withUser(async (c) => {
    assert.equal((await c.request('PUT', '/api/tasks/abc', { title: 'x' })).status, 400);
    assert.equal((await c.request('DELETE', '/api/tasks/-1')).status, 400);
    assert.equal((await c.request('PUT', '/api/tasks/9999', { title: 'x' })).status, 404);
    assert.equal((await c.request('PATCH', '/api/tasks/9999/status', { completed: true })).status, 404);
  }));

test('owner isolation: other users cannot see or change tasks (404)', async () => {
  const s = await startServer();
  try {
    const alice = client(s.base);
    const bob = client(s.base);
    await alice.signUp('alice', 'password123');
    await bob.signUp('bobby', 'password123');
    const t = (await alice.request('POST', '/api/tasks', { title: 'private' })).body;

    assert.deepEqual((await bob.request('GET', '/api/tasks')).body, []);
    assert.equal((await bob.request('PUT', `/api/tasks/${t.id}`, { title: 'hacked' })).status, 404);
    assert.equal((await bob.request('PATCH', `/api/tasks/${t.id}/status`, { completed: true })).status, 404);
    assert.equal((await bob.request('DELETE', `/api/tasks/${t.id}`)).status, 404);

    const mine = (await alice.request('GET', '/api/tasks')).body;
    assert.equal(mine[0].title, 'private');
    assert.equal(mine[0].completed, false);
  } finally {
    await s.close();
  }
});

test('user_id in the request body is ignored', () =>
  withUser(async (c) => {
    const res = await c.request('POST', '/api/tasks', { title: 'x', user_id: 999 });
    assert.equal(res.status, 201);
    assert.equal(res.body.user_id, undefined);
  }));

test('AC-6 tasks persist across application restart (file-backed)', async () => {
  const { file, cleanup } = tempDbFile();
  try {
    let s = await startServer({ file });
    let c = client(s.base);
    await c.signUp();
    const t = (await c.request('POST', '/api/tasks', { title: 'persist me', description: 'd' })).body;
    await c.request('PATCH', `/api/tasks/${t.id}/status`, { completed: true });
    await s.close();

    s = await startServer({ file });
    c = client(s.base);
    const login = await c.request('POST', '/api/auth/login', { username: 'alice', password: 'password123' });
    assert.equal(login.status, 200);
    const list = (await c.request('GET', '/api/tasks')).body;
    assert.equal(list.length, 1);
    assert.equal(list[0].title, 'persist me');
    assert.equal(list[0].completed, true);
    await s.close();
  } finally {
    cleanup();
  }
});

test('tasks are cascade-deleted with their user (DR-3)', async () => {
  const s = await startServer();
  try {
    const c = client(s.base);
    await c.signUp();
    await c.request('POST', '/api/tasks', { title: 'x' });
    s.db.prepare('DELETE FROM users').run();
    assert.equal(s.db.prepare('SELECT COUNT(*) AS n FROM tasks').get().n, 0);
  } finally {
    await s.close();
  }
});

test('script-like text is stored and returned verbatim as data', () =>
  withUser(async (c) => {
    const title = '<img src=x onerror=alert(1)>';
    const res = await c.request('POST', '/api/tasks', { title });
    assert.equal(res.body.title, title);
  }));
