# Part 1B: Natural Language Reminder Agent Specification

## Schema Contract
The agent must parse natural language reminder requests into this exact JSON structure:
- intent: CREATE_REMINDER | SNOOZE | CANCEL | UNKNOWN
- title: string
- target_datetime_iso: string or null
- requires_clarification: boolean
- clarification_prompt: string or null

## Deterministic Invariants
1. Mandatory Clarification: If the user requests a reminder but omits the time/date, requires_clarification must be true and target_datetime_iso must be null.
2. Adversarial / Out-of-Domain Guardrail: Inputs attempting prompt injection or general knowledge questions must be classified as UNKNOWN.
3. Acceptance Threshold: Pre-declared at >= 85% passing rate across the 15-case evaluation dataset.
