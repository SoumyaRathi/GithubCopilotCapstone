(() => {
  const $ = (id) => document.getElementById(id);
  const messageEl = $('message');

  function showMessage(text, ok = false) {
    messageEl.textContent = text;
    messageEl.className = ok ? 'ok' : '';
    messageEl.hidden = !text;
  }

  async function api(method, url, body) {
    const res = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 204) return null;
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (res.status === 401 && url.startsWith('/api/tasks')) showLoggedOut();
      throw new Error(data.error || 'Request failed');
    }
    return data;
  }

  function showLoggedOut() {
    $('auth-section').hidden = false;
    $('app-section').hidden = true;
  }

  function showLoggedIn(user) {
    $('current-user').textContent = user.username;
    $('auth-section').hidden = true;
    $('app-section').hidden = false;
    return loadTasks();
  }

  function resetForm() {
    $('task-form').reset();
    $('task-id').value = '';
    $('task-submit').textContent = 'Add task';
    $('task-cancel').hidden = true;
  }

  function button(label, onClick) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    b.addEventListener('click', () => onClick().catch((e) => showMessage(e.message)));
    return b;
  }

  function renderTask(task) {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';

    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = task.title;

    const status = document.createElement('span');
    status.className = 'status';
    status.textContent = task.completed ? 'Completed' : 'Pending';

    const desc = document.createElement('p');
    desc.className = 'desc';
    desc.textContent = task.description;

    const actions = document.createElement('div');
    actions.className = 'row';
    actions.append(
      button(task.completed ? 'Mark pending' : 'Mark completed', async () => {
        await api('PATCH', `/api/tasks/${task.id}/status`, { completed: !task.completed });
        await loadTasks();
      }),
      button('Edit', async () => {
        $('task-id').value = task.id;
        $('task-title').value = task.title;
        $('task-description').value = task.description;
        $('task-submit').textContent = 'Save changes';
        $('task-cancel').hidden = false;
        $('task-title').focus();
      }),
      button('Delete', async () => {
        if (!window.confirm('Delete this task permanently?')) return;
        await api('DELETE', `/api/tasks/${task.id}`);
        await loadTasks();
      })
    );

    li.append(title, status, desc, actions);
    return li;
  }

  async function loadTasks() {
    try {
      const tasks = await api('GET', '/api/tasks');
      const list = $('task-list');
      list.replaceChildren(...tasks.map(renderTask));
      $('empty').hidden = tasks.length > 0;
    } catch (e) {
      showMessage(e.message);
    }
  }

  async function authenticate(path) {
    showMessage('');
    const body = { username: $('username').value, password: $('password').value };
    try {
      if (path === 'register') {
        await api('POST', '/api/auth/register', body);
        showMessage('Registered. Logging in…', true);
      }
      const user = await api('POST', '/api/auth/login', body);
      $('password').value = '';
      showMessage('');
      await showLoggedIn(user);
    } catch (e) {
      showMessage(e.message);
    }
  }

  $('auth-form').addEventListener('submit', (e) => { e.preventDefault(); authenticate('login'); });
  $('register-btn').addEventListener('click', () => {
    if ($('auth-form').reportValidity()) authenticate('register');
  });

  $('logout-btn').addEventListener('click', async () => {
    try { await api('POST', '/api/auth/logout'); } catch (_) { /* session already gone */ }
    $('task-list').replaceChildren();
    resetForm();
    showLoggedOut();
  });

  $('task-cancel').addEventListener('click', resetForm);

  $('task-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    showMessage('');
    const id = $('task-id').value;
    const payload = { title: $('task-title').value, description: $('task-description').value };
    try {
      if (id) await api('PUT', `/api/tasks/${id}`, payload);
      else await api('POST', '/api/tasks', payload);
      resetForm();
      await loadTasks();
    } catch (err) {
      showMessage(err.message);
    }
  });

  // Tasks persist server-side, so an existing session restores the list after refresh.
  api('GET', '/api/auth/me').then(showLoggedIn).catch(showLoggedOut);
})();
