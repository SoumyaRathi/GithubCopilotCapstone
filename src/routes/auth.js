const express = require('express');
const { validateCredentials } = require('../validation');
const { AuthError, ConflictError } = require('../services/authService');
const { requireAuth, getToken, COOKIE_NAME } = require('../middleware/requireAuth');

function authRoutes(authService, { limiter } = {}) {
  const router = express.Router();
  if (limiter) router.use(limiter);

  const wrap = (fn) => (req, res, next) => fn(req, res).catch(next);

  router.post('/register', wrap(async (req, res) => {
    const creds = validateCredentials(req.body);
    try {
      res.status(201).json(await authService.register(creds));
    } catch (err) {
      if (err instanceof ConflictError) return res.status(409).json({ error: err.message });
      throw err;
    }
  }));

  router.post('/login', wrap(async (req, res) => {
    const creds = validateCredentials(req.body);
    try {
      const { token, user } = await authService.login(creds);
      res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: authService.SESSION_TTL_MS,
        path: '/',
      });
      res.json(user);
    } catch (err) {
      if (err instanceof AuthError) return res.status(401).json({ error: err.message });
      throw err;
    }
  }));

  router.get('/me', requireAuth(authService), (req, res) => res.json(req.user));

  router.post('/logout', requireAuth(authService), (req, res) => {
    authService.logout(getToken(req));
    res.clearCookie(COOKIE_NAME, { path: '/' });
    res.status(204).end();
  });

  return router;
}

module.exports = { authRoutes };
