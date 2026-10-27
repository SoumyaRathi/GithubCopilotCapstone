function toTask(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    completed: row.completed === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Every query is scoped to userId, which always comes from the session.
function createTaskService(db, { now = () => Date.now() } = {}) {
  const iso = () => new Date(now()).toISOString();
  const insert = db.prepare(
    'INSERT INTO tasks (user_id, title, description, completed, created_at, updated_at) VALUES (?, ?, ?, 0, ?, ?)'
  );
  const getOne = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?');
  const list = db.prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC, id DESC');
  const update = db.prepare(
    'UPDATE tasks SET title = ?, description = ?, updated_at = ? WHERE id = ? AND user_id = ?'
  );
  const setStatus = db.prepare(
    'UPDATE tasks SET completed = ?, updated_at = ? WHERE id = ? AND user_id = ?'
  );
  const remove = db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?');

  return {
    list: (userId) => list.all(userId).map(toTask),
    create(userId, { title, description }) {
      const ts = iso();
      const result = insert.run(userId, title, description, ts, ts);
      return toTask(getOne.get(Number(result.lastInsertRowid), userId));
    },
    update(userId, id, { title, description }) {
      const existing = getOne.get(id, userId);
      if (!existing) return null;
      const nextDescription = description === undefined ? existing.description : description;
      update.run(title, nextDescription, iso(), id, userId);
      return toTask(getOne.get(id, userId));
    },
    setCompleted(userId, id, completed) {
      const result = setStatus.run(completed ? 1 : 0, iso(), id, userId);
      return result.changes === 0 ? null : toTask(getOne.get(id, userId));
    },
    remove: (userId, id) => remove.run(id, userId).changes > 0,
  };
}

module.exports = { createTaskService };
