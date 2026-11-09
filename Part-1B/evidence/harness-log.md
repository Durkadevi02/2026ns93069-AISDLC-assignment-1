# Part 1B: Non-Deterministic Evaluation Audit Log

## Initial Run (Pre-repair Snapshot)
- **Status**: FAILED against acceptance criteria
- **Observed Issue**: Without defensive filtering, adversarial prompt injections (TC-12) and out-of-domain queries (TC-10, TC-11) were misclassified as reminder creation tasks.
- **Remediation**: Added guardrail filters in `src/agent.js` to normalize adversarial inputs and queries lacking actionability to `intent: "UNKNOWN"`.

## Final Run (Post-repair Evaluation)
- **Evaluation Runner**: `node Part-1B/.harness/eval_runner.js`
- **Results Output File**: `evidence/eval-results.json`
- **Acceptance Threshold**: >= 85.0%
- **Human Review Decision**: ACCEPT with known limitation (cross-UTC boundary timezone offsets require localized client timestamps).
