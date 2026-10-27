// Simple in-memory fixed-window limiter; resets on process restart (see README).
function rateLimit({ windowMs = 60_000, max = 30 } = {}) {
  const hits = new Map();
  return (req, res, next) => {
    const key = req.ip;
    const t = Date.now();
    let entry = hits.get(key);
    if (!entry || entry.resetAt <= t) {
      entry = { count: 0, resetAt: t + windowMs };
      hits.set(key, entry);
    }
    entry.count += 1;
    if (entry.count > max) return res.status(429).json({ error: 'Too many requests' });
    next();
  };
}

module.exports = { rateLimit };
