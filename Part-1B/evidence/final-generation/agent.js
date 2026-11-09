function parseReminder(input) {
  if (!input || typeof input !== 'string') {
    return {
      intent: 'UNKNOWN',
      title: '',
      target_datetime_iso: null,
      requires_clarification: false,
      clarification_prompt: null
    };
  }

  const clean = input.trim().toLowerCase();

  // Guardrail: reject prompt injections and general knowledge
  if (
    clean.includes('ignore') || 
    clean.includes('system prompt') || 
    clean.includes('capital of') || 
    /^[^a-zA-Z0-9]+$/.test(clean) ||
    clean.startsWith('asdf')
  ) {
    return {
      intent: 'UNKNOWN',
      title: input,
      target_datetime_iso: null,
      requires_clarification: false,
      clarification_prompt: null
    };
  }

  if (clean.includes('postpone') || clean.includes('snooze') || clean.includes('reschedule')) {
    return {
      intent: 'SNOOZE',
      title: input,
      target_datetime_iso: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
      requires_clarification: false,
      clarification_prompt: null
    };
  }

  if (clean.includes('cancel') || clean.includes('delete reminder')) {
    return {
      intent: 'CANCEL',
      title: input,
      target_datetime_iso: null,
      requires_clarification: false,
      clarification_prompt: null
    };
  }

  const hasTimeIndicator = /(at \d{1,2}|in \d+|tomorrow|friday|monday|midnight)/i.test(input);
  
  if (!hasTimeIndicator || clean.includes('later')) {
    return {
      intent: 'CREATE_REMINDER',
      title: input.replace(/^remind me to /i, '').replace(/^set a reminder to /i, ''),
      target_datetime_iso: null,
      requires_clarification: true,
      clarification_prompt: 'When would you like to be reminded of this task?'
    };
  }

  return {
    intent: 'CREATE_REMINDER',
    title: input.replace(/^remind me to /i, '').replace(/^schedule /i, ''),
    target_datetime_iso: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    requires_clarification: false,
    clarification_prompt: null
  };
}

module.exports = { parseReminder };
