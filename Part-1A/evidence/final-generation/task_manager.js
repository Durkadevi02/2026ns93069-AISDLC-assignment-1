const fs = require('fs');
const path = require('path');

const VALID_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];
const VALID_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

const ALLOWED_TRANSITIONS = {
  TODO: ['IN_PROGRESS'],
  IN_PROGRESS: ['DONE'],
  DONE: [] // Terminal state: cannot transition out of DONE
};

class TaskManager {
  constructor(storagePath) {
    this.storagePath = storagePath || path.join(__dirname, 'tasks.json');
    this.tasks = this._load();
  }

  _load() {
    if (!fs.existsSync(this.storagePath)) return [];
    try {
      return JSON.parse(fs.readFileSync(this.storagePath, 'utf8'));
    } catch {
      return [];
    }
  }

  _save() {
    fs.writeFileSync(this.storagePath, JSON.stringify(this.tasks, null, 2), 'utf8');
  }

  addTask(title, priority = 'MEDIUM') {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      throw new Error('Task title cannot be empty');
    }
    const cleanPriority = priority.toUpperCase();
    if (!VALID_PRIORITIES.includes(cleanPriority)) {
      throw new Error(`Invalid priority. Must be: ${VALID_PRIORITIES.join(', ')}`);
    }

    const task = {
      id: `task_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      title: title.trim(),
      priority: cleanPriority,
      status: 'TODO',
      createdAt: new Date().toISOString()
    };
    this.tasks.push(task);
    this._save();
    return task;
  }

  updateStatus(id, newStatus) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) throw new Error(`TaskNotFoundError: Task with ID ${id} not found`);

    const cleanStatus = newStatus.toUpperCase();
    if (!VALID_STATUSES.includes(cleanStatus)) {
      throw new Error(`Invalid status: ${newStatus}`);
    }

    const allowed = ALLOWED_TRANSITIONS[task.status] || [];
    if (!allowed.includes(cleanStatus)) {
      throw new Error(`InvalidStateTransitionError: Cannot transition from ${task.status} to ${cleanStatus}`);
    }

    task.status = cleanStatus;
    task.updatedAt = new Date().toISOString();
    this._save();
    return task;
  }

  listTasks(filterStatus = null) {
    if (!filterStatus) return [...this.tasks];
    return this.tasks.filter(t => t.status === filterStatus.toUpperCase());
  }

  deleteTask(id) {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx === -1) throw new Error(`TaskNotFoundError: Task with ID ${id} not found`);
    const removed = this.tasks.splice(idx, 1)[0];
    this._save();
    return removed;
  }
}

module.exports = { TaskManager };
