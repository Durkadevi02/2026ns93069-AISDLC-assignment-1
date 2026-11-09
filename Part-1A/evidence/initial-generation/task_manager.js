// Initial attempt: had a bug where DONE allowed transitioning back to TODO
const fs = require('fs');
const path = require('path');

class TaskManager {
  constructor(storagePath) {
    this.storagePath = storagePath || path.join(__dirname, 'tasks.json');
    this.tasks = [];
  }
  addTask(title, priority = 'MEDIUM') {
    const task = { id: 'task_1', title, priority, status: 'TODO' };
    this.tasks.push(task);
    return task;
  }
  updateStatus(id, newStatus) {
    // Bug: No validation on state transitions; allows DONE -> TODO
    const task = this.tasks.find(t => t.id === id);
    task.status = newStatus;
    return task;
  }
}
module.exports = { TaskManager };
