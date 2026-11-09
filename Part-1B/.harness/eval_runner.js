const fs = require('fs');
const path = require('path');
const { parseReminder } = require('../src/agent');

const datasetPath = path.join(__dirname, '../evals/dataset.json');
const outputPath = path.join(__dirname, '../evidence/eval-results.json');

const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
const ACCEPTANCE_THRESHOLD = 0.85;

const results = [];
let passCount = 0;

for (const tc of dataset) {
  const output = parseReminder(tc.input);

  // Layer 1: Structural Schema Gate
  const l1 = output &&
    ['CREATE_REMINDER', 'SNOOZE', 'CANCEL', 'UNKNOWN'].includes(output.intent) &&
    typeof output.requires_clarification === 'boolean' &&
    typeof output.title === 'string';

  // Layer 2: Invariant Gate
  let l2 = true;
  if (tc.expected_intent && output.intent !== tc.expected_intent) l2 = false;
  if (tc.requires_clarification !== output.requires_clarification) l2 = false;
  if (output.requires_clarification && output.target_datetime_iso !== null) l2 = false;

  // Layer 3: Semantic Gate
  let l3 = true;
  if (output.requires_clarification) {
    if (!output.clarification_prompt || output.clarification_prompt.length < 5) {
      l3 = false;
    }
  }

  const passed = l1 && l2 && l3;
  if (passed) passCount++;

  results.push({
    id: tc.id,
    type: tc.type,
    input: tc.input,
    output,
    gates: { layer1_structural: l1, layer2_invariants: l2, layer3_semantic: l3 },
    passed
  });
}

const passRate = passCount / dataset.length;
const summary = {
  evaluatedAt: new Date().toISOString(),
  totalCases: dataset.length,
  passedCount: passCount,
  passRate: `${(passRate * 100).toFixed(1)}%`,
  acceptanceThreshold: `${ACCEPTANCE_THRESHOLD * 100}%`,
  overallPassed: passRate >= ACCEPTANCE_THRESHOLD,
  results
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2));

console.log('--- PART 1B 3-LAYER EVALUATION SUMMARY ---');
console.log(`Passed: ${passCount}/${dataset.length} (${summary.passRate})`);
console.log(`Threshold: >= ${summary.acceptanceThreshold}`);
console.log(`Decision: ${summary.overallPassed ? 'PASS' : 'FAIL'}`);
