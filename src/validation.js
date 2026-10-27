class ValidationError extends Error {}

function fail(message) {
  throw new ValidationError(message);
}

function isObject(body) {
  return body !== null && typeof body === 'object' && !Array.isArray(body);
}

function validateCredentials(body) {
  if (!isObject(body)) fail('Request body must be a JSON object');
  const { username, password } = body;
  if (typeof username !== 'string' || !/^[A-Za-z0-9_]{3,30}$/.test(username)) {
    fail('Username must be 3-30 characters: letters, digits or underscore');
  }
  if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
    fail('Password must be 8-128 characters');
  }
  return { username, password };
}

function validateTitle(title) {
  if (typeof title !== 'string') fail('Title is required');
  const trimmed = title.trim();
  if (trimmed.length < 1 || trimmed.length > 100) fail('Title must be 1-100 characters');
  return trimmed;
}

function validateDescription(description) {
  if (typeof description !== 'string') fail('Description must be a string');
  if (description.length > 1000) fail('Description must be at most 1000 characters');
  return description;
}

// Create: description optional, defaults to ''.
function validateNewTask(body) {
  if (!isObject(body)) fail('Request body must be a JSON object');
  return {
    title: validateTitle(body.title),
    description: body.description === undefined ? '' : validateDescription(body.description),
  };
}

// Update (DR-1): title required; omitted description is preserved (undefined); '' clears it.
function validateTaskUpdate(body) {
  if (!isObject(body)) fail('Request body must be a JSON object');
  return {
    title: validateTitle(body.title),
    description: body.description === undefined ? undefined : validateDescription(body.description),
  };
}

function validateStatus(body) {
  if (!isObject(body) || typeof body.completed !== 'boolean') fail('completed must be a boolean');
  return body.completed;
}

function validateId(value) {
  if (!/^[1-9][0-9]{0,14}$/.test(String(value))) fail('Invalid task id');
  return Number(value);
}

module.exports = {
  ValidationError,
  validateCredentials,
  validateNewTask,
  validateTaskUpdate,
  validateStatus,
  validateId,
};
