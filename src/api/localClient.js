const STORAGE_PREFIX = 'vtc_local_';
const ACTIVE_USER_KEY = `${STORAGE_PREFIX}active_user`;
const EMAIL_LOG_KEY = `${STORAGE_PREFIX}email_log`;
const SCHEDULED_EMAILS_KEY = `${STORAGE_PREFIX}scheduled_emails`;
const FORM_SUBMIT_COOLDOWN_UNTIL_KEY = `${STORAGE_PREFIX}formsubmit_cooldown_until`;
const SUBMISSIONS_WEBHOOK_KEY = `${STORAGE_PREFIX}submissions_webhook_url`;
const LEGACY_SUBMISSIONS_WEBHOOK_KEYS = [
  `${STORAGE_PREFIX}google_sheets_webhook_url`,
  `${STORAGE_PREFIX}google_apps_script_webhook_url`,
  'submissions_webhook_url',
  'google_sheets_webhook_url',
];
const FORM_SUBMIT_BASE_URL = 'https://formsubmit.co/ajax';
const DEFAULT_SUBMISSIONS_WEBHOOK_URL = '';
const DEFAULT_FORM_SUBMIT_RELAY_TOKEN = '';
let warnedMissingWebhook = false;
let warnedDevWebhook = false;

function getEnvValue(...keys) {
  if (typeof import.meta === 'undefined' || !import.meta?.env) return '';
  for (const key of keys) {
    const value = import.meta.env[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return '';
}

function normalizeWebhookUrl(url) {
  const trimmed = String(url || '').trim();
  if (!trimmed) return '';

  // Apps Script webhooks must use /exec for anonymous web app calls.
  if (/\/dev(?:\?.*)?$/i.test(trimmed)) {
    if (!warnedDevWebhook) {
      warnedDevWebhook = true;
      console.warn('[VTC] Webhook URL ended with /dev; auto-switching to /exec for public form submissions.');
    }
    return trimmed.replace(/\/dev(\?.*)?$/i, '/exec$1');
  }

  return trimmed;
}

function findStoredWebhookUrl() {
  if (!isBrowser) return '';

  const primary = normalizeWebhookUrl(window.localStorage.getItem(SUBMISSIONS_WEBHOOK_KEY) || '');
  if (primary) return primary;

  for (const key of LEGACY_SUBMISSIONS_WEBHOOK_KEYS) {
    const legacyValue = normalizeWebhookUrl(window.localStorage.getItem(key) || '');
    if (legacyValue) {
      window.localStorage.setItem(SUBMISSIONS_WEBHOOK_KEY, legacyValue);
      return legacyValue;
    }
  }

  return '';
}

function bootstrapWebhookUrlFromQuery() {
  if (!isBrowser) return;
  const params = new URLSearchParams(window.location.search);
  const queryValue =
    params.get('submissions_webhook_url') ||
    params.get('submissionsWebhookUrl') ||
    params.get('vtcWebhookUrl');

  if (!queryValue) return;

  const normalized = normalizeWebhookUrl(queryValue);
  const clearRequested = /^(clear|reset|none)$/i.test(queryValue.trim());

  if (clearRequested) {
    window.localStorage.removeItem(SUBMISSIONS_WEBHOOK_KEY);
    return;
  }

  if (normalized) {
    window.localStorage.setItem(SUBMISSIONS_WEBHOOK_KEY, normalized);
  }
}

const FORM_SUBMIT_RELAY_TO =
  (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_FORMSUBMIT_RELAY_TO) ||
  '';
const FORM_SUBMIT_RELAY_TOKEN =
  (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_FORMSUBMIT_RELAY_TOKEN) ||
  DEFAULT_FORM_SUBMIT_RELAY_TOKEN;
const SUBMISSIONS_WEBHOOK_URL = normalizeWebhookUrl(
  getEnvValue(
    'VITE_SUBMISSIONS_WEBHOOK_URL',
    'VITE_GOOGLE_SHEETS_WEBHOOK_URL',
    'VITE_GOOGLE_SHEET_WEBHOOK_URL',
    'VITE_GOOGLE_APPS_SCRIPT_WEBHOOK_URL',
    'VITE_APPS_SCRIPT_WEBHOOK_URL'
  ) || DEFAULT_SUBMISSIONS_WEBHOOK_URL
);
const PROFIT_BASELINE_FORM_URL =
  (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_PROFIT_BASELINE_FORM_URL) || '';
const PROFIT_FOLLOWUP_FORM_URL =
  (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_PROFIT_FOLLOWUP_FORM_URL) || '';
const USE_EXTERNAL_PROFIT_AUTOMATION =
  String(
    (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_USE_GOOGLE_SHEETS_AUTOMATION) || 'false'
  ).toLowerCase() === 'true';
const OUTBOUND_EMAILS_ENABLED =
  String(
    (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_OUTBOUND_EMAILS_ENABLED) || 'false'
  ).toLowerCase() === 'true';
const PROFIT_BASELINE_DELAY_MINUTES = Number(
  (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_PROFIT_BASELINE_DELAY_MINUTES) || 0
);
const PROFIT_FOLLOWUP_DELAY_MINUTES = Number(
  (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_PROFIT_FOLLOWUP_DELAY_MINUTES) || 5
);
const PROFIT_BASELINE_DELAY_MS = Math.max(0, PROFIT_BASELINE_DELAY_MINUTES) * 60 * 1000;
const PROFIT_FOLLOWUP_DELAY_MS = Math.max(0, PROFIT_FOLLOWUP_DELAY_MINUTES) * 60 * 1000;
const EMAIL_SCHEDULER_POLL_MS = 30 * 1000;
const RATE_LIMIT_RETRY_DELAY_MS = 15 * 60 * 1000;
const MAX_SCHEDULED_EMAIL_RETRIES = 6;
const FORM_SUBMIT_COOLDOWN_MS = 30 * 60 * 1000;

const ENTITY_STORAGE_KEYS = {
  BusinessRequest: `${STORAGE_PREFIX}BusinessRequest`,
  BusinessStats: `${STORAGE_PREFIX}BusinessStats`,
  ContactInquiry: `${STORAGE_PREFIX}ContactInquiry`,
  StudentApplication: `${STORAGE_PREFIX}StudentApplication`,
  Testimonial: `${STORAGE_PREFIX}Testimonial`,
  WorkshopInterest: `${STORAGE_PREFIX}WorkshopInterest`,
};

const SHEET_TAB_HINT_BY_ENTITY = {
  BusinessRequest: 'Owners',
  StudentApplication: 'Students',
  WorkshopInterest: 'Workshops',
  BusinessStats: 'BeforeVsAfter',
};

const isBrowser = typeof window !== 'undefined';

function parseJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function readList(key) {
  if (!isBrowser) return [];
  const parsed = parseJson(window.localStorage.getItem(key), []);
  return Array.isArray(parsed) ? parsed : [];
}

function writeList(key, value) {
  if (!isBrowser) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function nowIso() {
  return new Date().toISOString();
}

function getFormSubmitCooldownUntil() {
  if (!isBrowser) return 0;
  const value = Number(window.localStorage.getItem(FORM_SUBMIT_COOLDOWN_UNTIL_KEY) || 0);
  return Number.isFinite(value) ? value : 0;
}

function setFormSubmitCooldownUntil(untilMs) {
  if (!isBrowser) return;
  window.localStorage.setItem(FORM_SUBMIT_COOLDOWN_UNTIL_KEY, String(untilMs));
}

function randomId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function sortItems(items, sort) {
  if (!sort) return items;
  const direction = sort.startsWith('-') ? -1 : 1;
  const field = sort.replace(/^-/, '');
  return [...items].sort((a, b) => {
    const av = a?.[field];
    const bv = b?.[field];
    if (av === bv) return 0;
    return av > bv ? direction : -direction;
  });
}

function ensureSeedData() {
  if (!isBrowser) return;

  if (!window.localStorage.getItem(ENTITY_STORAGE_KEYS.BusinessStats)) {
    writeList(ENTITY_STORAGE_KEYS.BusinessStats, []);
  }

  if (!window.localStorage.getItem(ENTITY_STORAGE_KEYS.Testimonial)) {
    writeList(ENTITY_STORAGE_KEYS.Testimonial, []);
  }
}

function getSubmissionsWebhookUrl() {
  if (!isBrowser) return SUBMISSIONS_WEBHOOK_URL;
  const stored = findStoredWebhookUrl();
  return stored || SUBMISSIONS_WEBHOOK_URL;
}

function queueScheduledEmail(emailTask) {
  const tasks = readList(SCHEDULED_EMAILS_KEY);
  tasks.push(emailTask);
  writeList(SCHEDULED_EMAILS_KEY, tasks);
}

function formatProfitFormBody({ ownerName, businessName, formUrl, isFollowUp }) {
  const greetingName = ownerName || 'there';
  const subjectContext = businessName ? ` for ${businessName}` : '';

  if (isFollowUp) {
    return `Hi ${greetingName},\n\nThis is your scheduled follow-up${subjectContext}.\n\nWhen you have a moment, please complete this optional progress form so we can understand how things changed after support:\n${formUrl || 'Please reply to this email with your updates.'}\n\nThank you,\nVoice the Companies`;
  }

  return `Hi ${greetingName},\n\nThanks for submitting your business request${subjectContext}.\n\nPlease complete your optional baseline form here:\n${formUrl || 'Please reply to this email with your current numbers.'}\n\nThis gives us your starting point so we can compare before/after outcomes later.\n\nThank you,\nVoice the Companies`;
}

async function mirrorSubmission(entityName, record) {
  const webhookUrl = getSubmissionsWebhookUrl();
  if (!webhookUrl) {
    if (!warnedMissingWebhook) {
      warnedMissingWebhook = true;
      console.warn(
        '[VTC] No submissions webhook configured. Set VITE_SUBMISSIONS_WEBHOOK_URL (or alias) or pass ?submissions_webhook_url=<apps-script-exec-url> once.'
      );
    }
    return;
  }

  try {
    const payload = JSON.stringify({
      entity: entityName,
      sheet_tab_hint: SHEET_TAB_HINT_BY_ENTITY[entityName] || '',
      submitted_at: nowIso(),
      data: record,
    });

    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        // Using a simple content type avoids browser preflight failures to Apps Script.
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: payload,
    });
  } catch (error) {
    console.warn('[VTC] Submission mirror failed', { entity: entityName, error });
  }
}

function createEntityApi(entityName) {
  const storageKey = ENTITY_STORAGE_KEYS[entityName] || `${STORAGE_PREFIX}${entityName}`;

  return {
    async list(sort = null) {
      const items = readList(storageKey);
      return sortItems(items, sort);
    },
    async filter(filters = {}) {
      const items = readList(storageKey);
      return items.filter((item) =>
        Object.entries(filters).every(([key, value]) => item?.[key] === value)
      );
    },
    async get(id) {
      const items = readList(storageKey);
      return items.find((item) => item.id === id) || null;
    },
    async create(payload) {
      const items = readList(storageKey);
      const timestamp = nowIso();
      const record = {
        ...payload,
        id: payload?.id || randomId(entityName.toLowerCase()),
        created_date: payload?.created_date || timestamp,
        updated_date: timestamp,
      };
      items.push(record);
      writeList(storageKey, items);
      await mirrorSubmission(entityName, record);
      return record;
    },
    async update(id, patch) {
      const items = readList(storageKey);
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) return null;
      items[index] = { ...items[index], ...patch, updated_date: nowIso() };
      writeList(storageKey, items);
      return items[index];
    },
    async delete(id) {
      const items = readList(storageKey);
      const nextItems = items.filter((item) => item.id !== id);
      writeList(storageKey, nextItems);
      return { id, deleted: true };
    },
  };
}

function getActiveUser() {
  if (!isBrowser) return null;
  const user = parseJson(window.localStorage.getItem(ACTIVE_USER_KEY), null);
  return user || null;
}

async function sendEmailWithFormSubmit(payload) {
  if (!OUTBOUND_EMAILS_ENABLED) {
    return {
      success: false,
      skipped: true,
      reason: 'Outbound emails disabled',
    };
  }

  if (!payload?.to) {
    throw new Error('Missing recipient email');
  }

  const relayRecipient = String(FORM_SUBMIT_RELAY_TO || '').trim();
  if (!relayRecipient) {
    return {
      success: false,
      skipped: true,
      reason: 'FormSubmit relay not configured',
    };
  }

  const intendedRecipient = String(payload.to || '').trim();
  const messageBody = payload.body || '';
  const relayBody = intendedRecipient
    ? `Intended recipient: ${intendedRecipient}\n\n${messageBody}`
    : messageBody;

  const cooldownUntil = getFormSubmitCooldownUntil();
  if (cooldownUntil > Date.now()) {
    return {
      success: false,
      skipped: true,
      reason: 'FormSubmit cooldown active',
      retry_after_ms: cooldownUntil,
    };
  }

  const relayPath = String(FORM_SUBMIT_RELAY_TOKEN || '').trim() || relayRecipient;
  const endpoint = `${FORM_SUBMIT_BASE_URL}/${encodeURIComponent(relayPath)}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      _subject: payload.subject || 'New form submission',
      _captcha: 'false',
      message: relayBody,
    }),
  });

  const responseData = await response.json().catch(() => ({}));
  const responseMessage = String(responseData?.message || '').toLowerCase();
  const rateLimited = response.status === 429 || responseMessage.includes('rate limit');
  const activationRequired =
    responseMessage.includes('activate form') ||
    responseMessage.includes('activation') ||
    responseMessage.includes('actived');

  if (rateLimited) {
    setFormSubmitCooldownUntil(Date.now() + FORM_SUBMIT_COOLDOWN_MS);
    console.warn('[VTC] FormSubmit rate limited; skipping hard failure', {
      relayRecipient,
      intendedRecipient,
      responseData,
    });
    return { success: false, skipped: true, reason: 'FormSubmit rate limited' };
  }

  if (activationRequired) {
    console.warn('[VTC] FormSubmit activation required; skipping hard failure', {
      relayRecipient,
      intendedRecipient,
      responseData,
    });
    return { success: false, skipped: true, reason: 'FormSubmit activation required' };
  }

  if (!response.ok || responseData?.success === 'false') {
    throw new Error(responseData?.message || 'Email relay request failed');
  }

  return { success: true };
}

async function flushScheduledEmails() {
  if (!isBrowser) return;

  const now = Date.now();
  const queued = readList(SCHEDULED_EMAILS_KEY);
  if (!queued.length) return;

  const pending = [];
  for (const task of queued) {
    const sendAt = Number(task?.send_at_ms || 0);
    if (!sendAt || sendAt > now) {
      pending.push(task);
      continue;
    }

    try {
      const result = await sendEmailWithFormSubmit(task.payload);
      if (result?.skipped && (result.reason === 'FormSubmit rate limited' || result.reason === 'FormSubmit cooldown active')) {
        const retryCount = Number(task?.retry_count || 0) + 1;
        if (retryCount <= MAX_SCHEDULED_EMAIL_RETRIES) {
          pending.push({
            ...task,
            retry_count: retryCount,
            send_at_ms: Date.now() + RATE_LIMIT_RETRY_DELAY_MS,
            last_error: result.reason,
          });
        }
        continue;
      }
    } catch (error) {
      const retryCount = Number(task?.retry_count || 0) + 1;
      if (retryCount <= MAX_SCHEDULED_EMAIL_RETRIES) {
        // Back off retry attempts to avoid repeated 429 loops.
        pending.push({
          ...task,
          retry_count: retryCount,
          send_at_ms: Date.now() + RATE_LIMIT_RETRY_DELAY_MS,
          last_error: String(error?.message || error),
        });
      }
      console.warn('[VTC] Scheduled email send failed; will retry', { error, task });
    }
  }

  writeList(SCHEDULED_EMAILS_KEY, pending);
}

function startScheduledEmailWorker() {
  if (!isBrowser) return;
  flushScheduledEmails();
  window.setInterval(() => {
    flushScheduledEmails();
  }, EMAIL_SCHEDULER_POLL_MS);
}

ensureSeedData();
bootstrapWebhookUrlFromQuery();
startScheduledEmailWorker();

export const localClient = {
  auth: {
    async isAuthenticated() {
      return Boolean(getActiveUser());
    },
    async me() {
      return getActiveUser();
    },
    redirectToLogin(returnTo = '/') {
      if (!isBrowser) return;
      if (!returnTo) return;
      window.location.href = returnTo;
    },
    logout(returnTo) {
      if (!isBrowser) return;
      window.localStorage.removeItem(ACTIVE_USER_KEY);
      if (returnTo) {
        window.location.href = returnTo;
      }
    },
  },
  entities: new Proxy(
    {},
    {
      get: (_, entityName) => createEntityApi(String(entityName)),
    }
  ),
  integrations: {
    Core: {
      async SendEmail(payload) {
        if (isBrowser) {
          const log = readList(EMAIL_LOG_KEY);
          log.push({ ...payload, sent_at: nowIso() });
          writeList(EMAIL_LOG_KEY, log);
          const delivery = await sendEmailWithFormSubmit(payload);
          const success = Boolean(delivery?.success);
          return {
            success,
            delivery,
            external_automation_enabled: USE_EXTERNAL_PROFIT_AUTOMATION,
          };
        }
        return { success: true };
      },
      async SendProfitJourneyEmails({ to, ownerName, businessName }) {
        return {
          success: true,
          skipped: true,
          reason: 'Handled by Google Apps Script sheet automation',
        };
      },
      async UploadFile() {
        return { file_url: '' };
      },
    },
  },
};

export default localClient;
