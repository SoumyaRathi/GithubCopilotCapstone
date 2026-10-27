const express = require('express');
const {
  validateNewTask,
  validateTaskUpdate,
  validateStatus,
  validateId,
} = require('../validation');

function tasksRoutes(taskService) {
  const router = express.Router();
  const notFound = (res) => res.status(404).json({ error: 'Task not found' });

  router.get('/', (req, res) => res.json(taskService.list(req.user.id)));

  router.post('/', (req, res) => {
    res.status(201).json(taskService.create(req.user.id, validateNewTask(req.body)));
  });

  router.put('/:id', (req, res) => {
    const id = validateId(req.params.id);
    const task = taskService.update(req.user.id, id, validateTaskUpdate(req.body));
    return task ? res.json(task) : notFound(res);
  });

  router.patch('/:id/status', (req, res) => {
    const id = validateId(req.params.id);
    const task = taskService.setCompleted(req.user.id, id, validateStatus(req.body));
    return task ? res.json(task) : notFound(res);
  });

  router.delete('/:id', (req, res) => {
    const id = validateId(req.params.id);
    return taskService.remove(req.user.id, id) ? res.status(204).end() : notFound(res);
  });

  return router;
}

module.exports = { tasksRoutes };
