const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { TaskManager } = require('../src/task_manager');

const testStorage = path.join(__dirname, 'test_tasks.json');

beforeEach(() => {
  if (fs.existsSync(testStorage)) fs.unlinkSync(testStorage);
});

afterEach(() => {
  if (fs.existsSync(testStorage)) fs.unlinkSync(testStorage);
});

test('addTask creates a valid task with TODO status', () => {
  const tm = new TaskManager(testStorage);
  const task = tm.addTask('Write unit tests', 'HIGH');
  assert.equal(task.title, 'Write unit tests');
  assert.equal(task.status, 'TODO');
  assert.equal(task.priority, 'HIGH');
});

test('valid lifecycle transitions: TODO -> IN_PROGRESS -> DONE', () => {
  const tm = new TaskManager(testStorage);
  const task = tm.addTask('Complete project');
  
  const step1 = tm.updateStatus(task.id, 'IN_PROGRESS');
  assert.equal(step1.status, 'IN_PROGRESS');

  const step2 = tm.updateStatus(task.id, 'DONE');
  assert.equal(step2.status, 'DONE');
});

test('invalid transition from DONE back to TODO must throw InvalidStateTransitionError', () => {
  const tm = new TaskManager(testStorage);
  const task = tm.addTask('Complete project');
  tm.updateStatus(task.id, 'IN_PROGRESS');
  tm.updateStatus(task.id, 'DONE');

  assert.throws(
    () => tm.updateStatus(task.id, 'TODO'),
    /InvalidStateTransitionError/
  );
});

test('delete non-existent task throws TaskNotFoundError', () => {
  const tm = new TaskManager(testStorage);
  assert.throws(
    () => tm.deleteTask('invalid_id'),
    /TaskNotFoundError/
  );
});
