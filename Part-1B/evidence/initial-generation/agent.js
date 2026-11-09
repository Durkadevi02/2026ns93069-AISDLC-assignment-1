// Initial generation: lacked prompt injection guardrails
function parseReminder(input) {
  return {
    intent: 'CREATE_REMINDER',
    title: input,
    target_datetime_iso: new Date().toISOString(),
    requires_clarification: false,
    clarification_prompt: null
  };
}
module.exports = { parseReminder };
