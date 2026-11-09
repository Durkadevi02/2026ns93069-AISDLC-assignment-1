# Constitution: Core Architectural Invariants

1. Pure Runtime: Standard Node.js (v20+) with zero external npm dependencies.
2. State Transition Invariant: Task status transitions must follow strictly:
   `TODO` -> `IN_PROGRESS` -> `DONE`.
   Transitions backward (e.g., `DONE` -> `TODO`) or skipping steps are strictly prohibited.
3. Persistence: All task modifications must persist to local JSON synchronously.
4. Security: Dynamic code execution (`eval`, `new Function`) is strictly forbidden.
