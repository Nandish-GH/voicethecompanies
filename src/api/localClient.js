const STORAGE_PREFIX = 'vtc_local_';
const ACTIVE_USER_KEY = `${STORAGE_PREFIX}active_user`;
const EMAIL_LOG_KEY = `${STORAGE_PREFIX}email_log`;
const SCHEDULED_EMAILS_KEY = `${STORAGE_PREFIX}scheduled_emails`;
const FORM_SUBMIT_COOLDOWN_UNTIL_KEY = `${STORAGE_PREFIX}formsubmit_cooldown_until`;
const SUBMISSIONS_WEBHOOK_KEY = `${STORAGE_PREFIX}submissions_webhook_url`;
const FORM_SUBMIT_BASE_URL = 'https://formsubmit.co/ajax';
const DEFAULT_SUBMISSIONS_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbypMUt_t88wVFg6ID6e1AhOQbuQ4mfaiqXhnGQk7WwdmGG67N1KDHhjas5tzDL5cCXP/exec';
const DEFAULT_FORM_SUBMIT_RELAY_TOKEN = '75a71653f574fd04c7ea1f7e4f116f93';
const FORM_SUBMIT_RELAY_TO =
  (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_FORMSUBMIT_RELAY_TO) ||
  'voicethecompanies@gmail.com';
const FORM_SUBMIT_RELAY_TOKEN =
  (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_FORMSUBMIT_RELAY_TOKEN) ||
  DEFAULT_FORM_SUBMIT_RELAY_TOKEN;
const SUBMISSIONS_WEBHOOK_URL =
  (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_SUBMISSIONS_WEBHOOK_URL) ||
  DEFAULT_SUBMISSIONS_WEBHOOK_URL;
const PROFIT_BASELINE_FORM_URL =
  (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_PROFIT_BASELINE_FORM_URL) || '';
const PROFIT_FOLLOWUP_FORM_URL =
  (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_PROFIT_FOLLOWUP_FORM_URL) || '';
const USE_EXTERNAL_PROFIT_AUTOMATION =
  String(
    (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_USE_GOOGLE_SHEETS_AUTOMATION) || 'false'
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

const demoUser = {
  id: 'local-user-1',
  full_name: 'Local Business Owner',
  email: 'voicethecompanies@gmail.com',
};

const initialBusinessStats = [
  {
    id: 'stats-1',
    business_name: 'Voice the Companies Demo',
    owner_email: demoUser.email,
    period_label: 'Month 1',
    website_sessions: 120,
    unique_visitors: 88,
    social_followers: 45,
    social_reach: 280,
    google_profile_views: 92,
    google_direction_requests: 8,
    confidence_website: 3,
    confidence_social: 3,
    confidence_analytics: 2,
    notes: 'Baseline numbers after launch.',
    created_date: '2026-01-15T00:00:00.000Z',
    updated_date: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'stats-2',
    business_name: 'Voice the Companies Demo',
    owner_email: demoUser.email,
    period_label: 'Month 3',
    website_sessions: 210,
    unique_visitors: 151,
    social_followers: 102,
    social_reach: 610,
    google_profile_views: 164,
    google_direction_requests: 19,
    confidence_website: 4,
    confidence_social: 4,
    confidence_analytics: 3,
    notes: 'Steady growth after social posting routine.',
    created_date: '2026-03-01T00:00:00.000Z',
    updated_date: '2026-03-01T00:00:00.000Z',
  },
];

const initialTestimonials = [
  {
    id: 'testimonial-1',
    author_name: 'Maria Santos',
    role: 'business_owner',
    business_name: 'Santos Bakery',
    quote: 'Our student team gave us a website we can actually maintain ourselves.',
    featured: true,
    created_date: '2026-02-01T00:00:00.000Z',
    updated_date: '2026-02-01T00:00:00.000Z',
  },
  {
    id: 'testimonial-2',
    author_name: 'James Chen',
    role: 'student',
    quote: 'Working on a real project taught me skills that classes never covered.',
    featured: true,
    created_date: '2026-02-05T00:00:00.000Z',
    updated_date: '2026-02-05T00:00:00.000Z',
  },
];

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

  if (!window.localStorage.getItem(ACTIVE_USER_KEY)) {
    window.localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(demoUser));
  }

  if (!window.localStorage.getItem(ENTITY_STORAGE_KEYS.BusinessStats)) {
    writeList(ENTITY_STORAGE_KEYS.BusinessStats, initialBusinessStats);
  }

  if (!window.localStorage.getItem(ENTITY_STORAGE_KEYS.Testimonial)) {
    writeList(ENTITY_STORAGE_KEYS.Testimonial, initialTestimonials);
  }
}

function getSubmissionsWebhookUrl() {
  if (!isBrowser) return SUBMISSIONS_WEBHOOK_URL;
  return window.localStorage.getItem(SUBMISSIONS_WEBHOOK_KEY) || SUBMISSIONS_WEBHOOK_URL;
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

function isDemoOrUnsupportedRecipient(email) {
  if (!email) return true;
  const normalized = String(email).trim().toLowerCase();
  if (!normalized.includes('@')) return true;
  return (
    normalized.endsWith('@example.com') ||
    normalized.endsWith('.example') ||
    normalized.endsWith('@test.com')
  );
}

async function mirrorSubmission(entityName, record) {
  const webhookUrl = getSubmissionsWebhookUrl();
  if (!webhookUrl) return;

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
  if (!isBrowser) return demoUser;
  const user = parseJson(window.localStorage.getItem(ACTIVE_USER_KEY), demoUser);
  return user || demoUser;
}

async function sendEmailWithFormSubmit(payload) {
  if (!payload?.to) {
    throw new Error('Missing recipient email');
  }

  const relayRecipient = String(FORM_SUBMIT_RELAY_TO || '').trim();
  if (!relayRecipient) {
    throw new Error('Missing FormSubmit relay recipient');
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
startScheduledEmailWorker();

export const localClient = {
  auth: {
    async isAuthenticated() {
      return true;
    },
    async me() {
      return getActiveUser();
    },
    redirectToLogin(returnTo = '/') {
      if (!isBrowser) return;
      const user = getActiveUser();
      window.localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
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
          return {
            success: true,
            delivery,
            external_automation_enabled: USE_EXTERNAL_PROFIT_AUTOMATION,
          };
        }
        return { success: true };
      },
      async SendProfitJourneyEmails({ to, ownerName, businessName }) {
        if (!to) {
          throw new Error('Missing recipient email for profit journey emails');
        }

        if (USE_EXTERNAL_PROFIT_AUTOMATION) {
          return {
            success: true,
            skipped: true,
            reason: 'Handled by external Google Sheets automation',
          };
        }

        if (isDemoOrUnsupportedRecipient(to)) {
          return {
            success: true,
            skipped: true,
            reason: 'Demo or unsupported recipient for FormSubmit relay',
          };
        }

        const baselineSubject = `Action Requested: Optional Profit Baseline Form${businessName ? ` (${businessName})` : ''}`;
        const baselineBody = formatProfitFormBody({
          ownerName,
          businessName,
          formUrl: PROFIT_BASELINE_FORM_URL,
          isFollowUp: false,
        });

        if (PROFIT_BASELINE_DELAY_MS <= 0) {
          await sendEmailWithFormSubmit({
            to,
            subject: baselineSubject,
            body: baselineBody,
          });
        } else {
          queueScheduledEmail({
            id: randomId('scheduled-email'),
            send_at_ms: Date.now() + PROFIT_BASELINE_DELAY_MS,
            payload: {
              to,
              subject: baselineSubject,
              body: baselineBody,
            },
          });
        }

        if (USE_EXTERNAL_PROFIT_AUTOMATION) {
          return {
            success: true,
            baseline_sent_by_app: true,
            followup_skipped: true,
            reason: 'Follow-up handled by external Google Sheets automation',
          };
        }

        const followupSubject = `Profit Follow-Up Form${businessName ? `: ${businessName}` : ''}`;
        const followupBody = formatProfitFormBody({
          ownerName,
          businessName,
          formUrl: PROFIT_FOLLOWUP_FORM_URL || PROFIT_BASELINE_FORM_URL,
          isFollowUp: true,
        });

        if (PROFIT_FOLLOWUP_DELAY_MS <= 0) {
          await sendEmailWithFormSubmit({
            to,
            subject: followupSubject,
            body: followupBody,
          });
        } else {
          queueScheduledEmail({
            id: randomId('scheduled-email'),
            send_at_ms: Date.now() + PROFIT_FOLLOWUP_DELAY_MS,
            payload: {
              to,
              subject: followupSubject,
              body: followupBody,
            },
          });
        }

        return {
          success: true,
          baseline_delay_minutes: PROFIT_BASELINE_DELAY_MINUTES,
          followup_delay_minutes: PROFIT_FOLLOWUP_DELAY_MINUTES,
        };
      },
      async UploadFile() {
        return { file_url: '' };
      },
    },
  },
};

export default localClient;
