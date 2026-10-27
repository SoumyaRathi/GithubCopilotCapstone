const path = require('node:path');
const express = require('express');
const { createAuthService } = require('./services/authService');
const { createTaskService } = require('./services/taskService');
const { requireAuth } = require('./middleware/requireAuth');
const { rateLimit } = require('./middleware/rateLimit');
const { authRoutes } = require('./routes/auth');
const { tasksRoutes } = require('./routes/tasks');
const { ValidationError } = require('./validation');

// db is injected so tests can use isolated databases; options.now allows clock control in tests.
function createApp(db, options = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '10kb' }));

  const authService = createAuthService(db, options);
  const taskService = createTaskService(db, options);

  app.use('/api/auth', authRoutes(authService, { limiter: rateLimit(options.rateLimit) }));
  app.use('/api/tasks', requireAuth(authService), tasksRoutes(taskService));
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
    if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON' });
    if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Request too large' });
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

module.exports = { createApp };
