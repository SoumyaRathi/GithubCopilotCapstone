const COOKIE_NAME = 'sid';

function parseCookies(header) {
  const out = {};
  for (const part of String(header || '').split(';')) {
    const idx = part.indexOf('=');
    if (idx > 0) out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  }
  return out;
}

function getToken(req) {
  return parseCookies(req.headers.cookie)[COOKIE_NAME];
}

function requireAuth(authService) {
  return (req, res, next) => {
    const user = authService.authenticate(getToken(req));
    if (!user) return res.status(401).json({ error: 'Authentication required' });
    req.user = user;
    next();
  };
}

module.exports = { requireAuth, getToken, COOKIE_NAME };
