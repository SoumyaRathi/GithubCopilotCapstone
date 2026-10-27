const crypto = require('node:crypto');

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function scrypt(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, key) => (err ? reject(err) : resolve(key)));
  });
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

class AuthError extends Error {}
class ConflictError extends Error {}

function createAuthService(db, { now = () => Date.now() } = {}) {
  const insertUser = db.prepare(
    'INSERT INTO users (username, password_hash, salt, created_at) VALUES (?, ?, ?, ?)'
  );
  const findUser = db.prepare('SELECT * FROM users WHERE username = ?');
  const insertSession = db.prepare(
    'INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)'
  );
  const findSession = db.prepare(
    `SELECT u.id AS id, u.username AS username, s.expires_at AS expires_at
     FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ?`
  );
  const deleteSession = db.prepare('DELETE FROM sessions WHERE token_hash = ?');

  async function register({ username, password }) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = (await scrypt(password, salt)).toString('hex');
    try {
      const result = insertUser.run(username, hash, salt, new Date(now()).toISOString());
      return { id: Number(result.lastInsertRowid), username };
    } catch (err) {
      if (/UNIQUE/i.test(String(err.message))) throw new ConflictError('Username already taken');
      throw err;
    }
  }

  async function login({ username, password }) {
    const user = findUser.get(username);
    // Always run scrypt so unknown usernames cost the same as bad passwords.
    const salt = user ? user.salt : 'x'.repeat(32);
    const candidate = await scrypt(password, salt);
    const valid =
      user && crypto.timingSafeEqual(candidate, Buffer.from(user.password_hash, 'hex'));
    if (!valid) throw new AuthError('Invalid username or password');
    const token = crypto.randomBytes(32).toString('hex');
    insertSession.run(hashToken(token), user.id, new Date(now() + SESSION_TTL_MS).toISOString());
    return { token, user: { id: user.id, username: user.username } };
  }

  // Returns the user for a valid, unexpired token; expired sessions are removed (DR-2).
  function authenticate(token) {
    if (typeof token !== 'string' || !token) return null;
    const tokenHash = hashToken(token);
    const row = findSession.get(tokenHash);
    if (!row) return null;
    if (Date.parse(row.expires_at) <= now()) {
      deleteSession.run(tokenHash);
      return null;
    }
    return { id: row.id, username: row.username };
  }

  function logout(token) {
    if (typeof token === 'string' && token) deleteSession.run(hashToken(token));
  }

  return { register, login, authenticate, logout, SESSION_TTL_MS };
}

module.exports = { createAuthService, AuthError, ConflictError };
