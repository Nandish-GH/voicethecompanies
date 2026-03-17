/*
Google Apps Script webhook for Voice the Companies submissions.
Deploy as a Web App and use the URL as VITE_SUBMISSIONS_WEBHOOK_URL.

This script creates and routes rows into exactly 4 tabs:
- Owners
- Students
- Workshops
- BeforeVsAfter
*/

const TAB_OWNERS = 'Owners';
const TAB_STUDENTS = 'Students';
const TAB_WORKSHOPS = 'Workshops';
const TAB_BEFORE_AFTER = 'BeforeVsAfter';
const SHEET_DATE_FORMAT = 'MMM d, yyyy h:mm a';

// Mail merge configuration for the same source sheet.
const MAIL_TAB = TAB_OWNERS;
const MAIL_RECIPIENT_COL = 'email';
const MAIL_STATUS_COL = 'Email Sent';
const MAIL_DRAFT_SUBJECT = 'VTC Baseline Form';
const MAIL_SENDER_NAME = 'Voice the Companies';
const MAIL_TRIGGER_HANDLER = 'runAutomatedOwnerEmailJob';
const MAIL_TRIGGER_EVERY_MINUTES = 5;

const TAB_HEADERS = {
  [TAB_OWNERS]: ['submitted_at', 'entity', 'id', 'business_name', 'owner_name', 'email', 'phone', 'business_type', 'website_exists', 'services_needed', 'additional_info', 'created_date', 'updated_date'],
  [TAB_STUDENTS]: ['submitted_at', 'entity', 'id', 'full_name', 'email', 'phone', 'school', 'grade_level', 'interests', 'experience', 'why_interested', 'created_date', 'updated_date'],
  [TAB_WORKSHOPS]: ['submitted_at', 'entity', 'id', 'name', 'email', 'workshop_title', 'workshop_timing', 'workshop_format', 'workshop_duration', 'subject', 'message', 'status', 'created_date', 'updated_date'],
  [TAB_BEFORE_AFTER]: ['submitted_at', 'entity', 'id', 'business_name', 'owner_email', 'period_label', 'website_sessions', 'unique_visitors', 'social_followers', 'social_reach', 'google_profile_views', 'google_direction_requests', 'confidence_website', 'confidence_social', 'confidence_analytics', 'notes', 'created_date', 'updated_date'],
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('VTC Mail')
    .addItem('Setup VTC System', 'setupVtcSystem')
    .addItem('Send Pending Owner Emails', 'sendOwnerEmailsFromDraft')
    .addItem('Enable Auto Email Scheduler', 'enableAutoEmailScheduler')
    .addItem('Disable Auto Email Scheduler', 'disableAutoEmailScheduler')
    .addToUi();
}

function setupVtcSystem() {
  ensureTabsExist_();
  const ownersSheet = getOrCreateSheet_(TAB_OWNERS);
  const ownersHeaders = TAB_HEADERS[TAB_OWNERS];
  ensureHeader_(ownersSheet, ownersHeaders);

  const ownerHeaderValues = ownersSheet
    .getRange(1, 1, 1, ownersSheet.getLastColumn() || ownersHeaders.length)
    .getValues()[0]
    .filter((v) => String(v || '').trim() !== '');
  ensureStatusColumn_(ownersSheet, ownerHeaderValues, MAIL_STATUS_COL);
  ensureAutoEmailTrigger_();
}

function enableAutoEmailScheduler() {
  ensureAutoEmailTrigger_();
}

function disableAutoEmailScheduler() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach((trigger) => {
    if (trigger.getHandlerFunction() === MAIL_TRIGGER_HANDLER) {
      ScriptApp.deleteTrigger(trigger);
    }
  });
}

function ensureAutoEmailTrigger_() {
  const triggers = ScriptApp.getProjectTriggers();
  const exists = triggers.some((trigger) => trigger.getHandlerFunction() === MAIL_TRIGGER_HANDLER);
  if (exists) return;

  ScriptApp.newTrigger(MAIL_TRIGGER_HANDLER)
    .timeBased()
    .everyMinutes(MAIL_TRIGGER_EVERY_MINUTES)
    .create();
}

function runAutomatedOwnerEmailJob() {
  sendOwnerEmailsFromDraft();
}

function getAuthorizedRunnerEmail_() {
  try {
    const email = Session.getEffectiveUser().getEmail();
    return String(email || '').trim();
  } catch (_) {
    return '';
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: 'vtc-webhook', status: 'ready' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const payload = parseIncomingPayload_(e);

    const entity = String(payload.entity || '').trim();
    const submittedAt = String(payload.submitted_at || new Date().toISOString());
    const data = (payload && typeof payload.data === 'object' && payload.data) ? payload.data : {};

    ensureTabsExist_();
    const tabName = resolveTabName(entity, data, payload.sheet_tab_hint);
    const sheet = getOrCreateSheet_(tabName);
    const headers = TAB_HEADERS[tabName];
    ensureHeader_(sheet, headers);

    const row = headers.map((key) => {
      if (key === 'submitted_at') return formatTimestampForSheet_(submittedAt);
      if (key === 'entity') return entity;
      const value = data[key];
      if (value === null || typeof value === 'undefined') return '';
      if (isTimestampField_(key)) return formatTimestampForSheet_(value);
      if (typeof value === 'object') return JSON.stringify(value);
      return value;
    });

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, tab: tabName }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(error && error.message ? error.message : error) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function parseIncomingPayload_(e) {
  const empty = {};
  if (!e) return empty;

  const rawBody = (e.postData && typeof e.postData.contents === 'string') ? e.postData.contents : '';
  if (rawBody) {
    try {
      const parsed = JSON.parse(rawBody);
      if (parsed && typeof parsed === 'object') return parsed;
    } catch (_) {
      // Continue with other parsing strategies.
    }
  }

  const params = (e.parameter && typeof e.parameter === 'object') ? e.parameter : {};
  if (params.payload) {
    try {
      const parsedPayload = JSON.parse(String(params.payload));
      if (parsedPayload && typeof parsedPayload === 'object') return parsedPayload;
    } catch (_) {
      // Continue with flattened parameter fallback.
    }
  }

  const hasFlatKeys = params.entity || params.submitted_at || params.email || params.owner_email;
  if (hasFlatKeys) {
    const flatData = { ...params };
    delete flatData.entity;
    delete flatData.submitted_at;
    delete flatData.sheet_tab_hint;
    return {
      entity: params.entity || '',
      submitted_at: params.submitted_at || new Date().toISOString(),
      sheet_tab_hint: params.sheet_tab_hint || '',
      data: flatData,
    };
  }

  return empty;
}

function isTimestampField_(key) {
  return key === 'submitted_at' || key.endsWith('_date');
}

function formatTimestampForSheet_(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return Utilities.formatDate(date, Session.getScriptTimeZone(), SHEET_DATE_FORMAT);
}

function resolveTabName(entity, data, sheetTabHint) {
  const hint = String(sheetTabHint || '').trim();
  if (hint && TAB_HEADERS[hint]) return hint;

  if (entity === 'BusinessRequest') return TAB_OWNERS;
  if (entity === 'StudentApplication') return TAB_STUDENTS;
  if (entity === 'WorkshopInterest') return TAB_WORKSHOPS;
  if (entity === 'BusinessStats') return TAB_BEFORE_AFTER;

  // Backward compatibility: old workshop rows were sent as ContactInquiry with workshop subject.
  if (entity === 'ContactInquiry') {
    const subject = String((data && data.subject) || '').toLowerCase();
    if (subject.includes('workshop interest')) return TAB_WORKSHOPS;
  }

  // Default fallback for unknown types.
  return TAB_OWNERS;
}

function ensureTabsExist_() {
  [TAB_OWNERS, TAB_STUDENTS, TAB_WORKSHOPS, TAB_BEFORE_AFTER].forEach((tabName) => {
    const sheet = getOrCreateSheet_(tabName);
    const headers = TAB_HEADERS[tabName];
    ensureHeader_(sheet, headers);
  });
}

function getOrCreateSheet_(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function sendOwnerEmailsFromDraft() {
  ensureTabsExist_();
  const sheet = getOrCreateSheet_(MAIL_TAB);
  const dataRange = sheet.getDataRange();
  const values = dataRange.getDisplayValues();
  if (values.length < 2) return;

  const headers = values[0];
  const recipientColIdx = headers.indexOf(MAIL_RECIPIENT_COL);
  const statusColIdx = ensureStatusColumn_(sheet, headers, MAIL_STATUS_COL);

  if (recipientColIdx === -1) {
    throw new Error('Missing required column: ' + MAIL_RECIPIENT_COL);
  }

  const template = getGmailTemplateFromDrafts_(MAIL_DRAFT_SUBJECT);
  const rows = values.slice(1).map((r) =>
    headers.reduce((obj, key, i) => {
      obj[key] = r[i] || '';
      return obj;
    }, {})
  );

  const out = [];
  rows.forEach((row) => {
    const alreadySent = String(row[MAIL_STATUS_COL] || '').trim();
    const recipient = String(row[MAIL_RECIPIENT_COL] || '').trim();

    if (alreadySent) {
      out.push([alreadySent]);
      return;
    }

    if (!recipient || recipient.indexOf('@') === -1) {
      out.push(['Invalid or missing recipient']);
      return;
    }

    try {
      const filled = fillInTemplateFromObject_(template.message, row);
      GmailApp.sendEmail(recipient, filled.subject, filled.text, {
        htmlBody: filled.html,
        name: MAIL_SENDER_NAME,
        replyTo: getAuthorizedRunnerEmail_() || undefined,
        attachments: template.attachments,
        inlineImages: template.inlineImages,
      });
      out.push([new Date()]);
    } catch (error) {
      out.push([String(error && error.message ? error.message : error)]);
    }
  });

  sheet.getRange(2, statusColIdx + 1, out.length, 1).setValues(out);
}

function ensureStatusColumn_(sheet, headers, statusColName) {
  const idx = headers.indexOf(statusColName);
  if (idx !== -1) return idx;

  const newColIndex = headers.length + 1;
  sheet.getRange(1, newColIndex).setValue(statusColName);
  return newColIndex - 1;
}

function getGmailTemplateFromDrafts_(subjectLine) {
  const drafts = GmailApp.getDrafts();
  const draft = drafts.find((d) => d.getMessage().getSubject() === subjectLine);
  if (!draft) {
    throw new Error('No draft found with subject: ' + subjectLine);
  }

  const msg = draft.getMessage();
  const htmlBody = msg.getBody();

  const allInlineImages = msg.getAttachments({
    includeInlineImages: true,
    includeAttachments: false,
  });
  const attachments = msg.getAttachments({
    includeInlineImages: false,
    includeAttachments: true,
  });

  const imageByName = allInlineImages.reduce((obj, img) => {
    obj[img.getName()] = img;
    return obj;
  }, {});

  const inlineImages = {};
  const imgRegex = /<img.*?src="cid:(.*?)".*?alt="(.*?)"[^>]*>/g;
  const matches = [...htmlBody.matchAll(imgRegex)];
  matches.forEach((m) => {
    const cid = m[1];
    const altName = m[2];
    if (imageByName[altName]) {
      inlineImages[cid] = imageByName[altName];
    }
  });

  return {
    message: {
      subject: subjectLine,
      text: msg.getPlainBody(),
      html: htmlBody,
    },
    attachments,
    inlineImages,
  };
}

function fillInTemplateFromObject_(template, data) {
  let templateString = JSON.stringify(template);
  templateString = templateString.replace(/{{[^{}]+}}/g, (token) => {
    const key = token.replace(/[{}]+/g, '');
    return escapeData_(String(data[key] || ''));
  });
  return JSON.parse(templateString);
}

function escapeData_(str) {
  return str
    .replace(/[\\]/g, '\\\\')
    .replace(/[\"]/g, '\\"')
    .replace(/[\/]/g, '\\/')
    .replace(/[\b]/g, '\\b')
    .replace(/[\f]/g, '\\f')
    .replace(/[\n]/g, '\\n')
    .replace(/[\r]/g, '\\r')
    .replace(/[\t]/g, '\\t');
}

function ensureHeader_(sheet, headers) {
  const hasAnyData = sheet.getLastRow() > 0;
  if (!hasAnyData) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    return;
  }

  const existingHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const exactMatch = headers.every((h, i) => String(existingHeaders[i] || '') === h);
  if (!exactMatch) {
    sheet.insertRowBefore(1);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
}
