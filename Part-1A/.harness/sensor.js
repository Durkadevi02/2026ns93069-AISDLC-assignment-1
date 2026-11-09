const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const targetDir = path.resolve(__dirname, '..');
const srcFile = path.join(targetDir, 'src', 'task_manager.js');
const testFile = path.join(targetDir, 'tests', 'task_manager.test.js');
const reportPath = path.join(targetDir, 'evidence', 'sensor-report.json');

const findings = [];

// Gate 1: Static SAST & Architecture Check
if (!fs.existsSync(srcFile)) {
  findings.push({ gate: 'STATIC_FILE', code: 'MISSING_SRC', message: 'src/task_manager.js missing' });
} else {
  const code = fs.readFileSync(srcFile, 'utf8');
  if (/eval\(|new Function\(/.test(code)) {
    findings.push({ gate: 'STATIC_SAST', code: 'SECURITY_VULNERABILITY', message: 'eval/Function execution forbidden' });
  }
  if (!code.includes('writeFileSync')) {
    findings.push({ gate: 'STATIC_ARCH', code: 'MISSING_PERSISTENCE', message: 'Synchronous write persistence missing' });
  }
}

// Gate 2: Dynamic Unit Tests
let dynamicPassed = false;
let dynamicOutput = '';

if (findings.length === 0) {
  const result = spawnSync(process.execPath, ['--test', testFile], {
    cwd: targetDir,
    encoding: 'utf8',
    timeout: 10000
  });
  dynamicPassed = result.status === 0;
  dynamicOutput = result.stdout || result.stderr;
  if (!dynamicPassed) {
    findings.push({ gate: 'DYNAMIC_TEST', code: 'TEST_FAILURE', message: dynamicOutput });
  }
}

const report = {
  timestamp: new Date().toISOString(),
  staticChecksPassed: findings.filter(f => f.gate.startsWith('STATIC')).length === 0,
  dynamicTestsPassed: dynamicPassed,
  overallPassed: findings.length === 0 && dynamicPassed,
  findings
};

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log('--- HARNESS SENSOR REPORT ---');
console.log(JSON.stringify(report, null, 2));
process.exit(report.overallPassed ? 0 : 1);
