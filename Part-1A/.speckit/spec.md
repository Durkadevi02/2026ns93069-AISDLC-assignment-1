# Functional Specification: Smart Todo Engine

## Required Operations
- `addTask(title, priority)`: Creates a task with status `TODO`, unique ID, ISO timestamp, and priority (`LOW`, `MEDIUM`, `HIGH`).
- `updateStatus(id, newStatus)`: Updates task status. Throws `InvalidStateTransitionError` if transition violates lifecycle rules.
- `listTasks(filterStatus)`: Returns all tasks or filters by status.
- `deleteTask(id)`: Deletes task by ID; throws `TaskNotFoundError` if ID does not exist.
