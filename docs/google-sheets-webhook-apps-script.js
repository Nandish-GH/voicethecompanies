/*
Scheduler-only Apps Script for automated owner emails.

Handoff note:
1) During development, you can run this script as your own Google account.
2) For production, set MAIL_ENFORCE_SENDER_ACCOUNT = true so only the
  client account can run the trigger.
*/

const MAIL_SHEET_NAME = 'Owners';
const MAIL_RECIPIENT_COL = 'email';
const MAIL_STATUS_COL = 'Email Sent';
const MAIL_OWNER_NAME_COL = 'owner_name';
const MAIL_BUSINESS_NAME_COL = 'business_name';
const TARGET_SPREADSHEET_ID = '';

const WEBHOOK_SHEET_BY_ENTITY = {
  BusinessRequest: 'Owners',
  StudentApplication: 'Students',
  WorkshopInterest: 'Workshops',
  BusinessStats: 'BeforeVsAfter',
};
const WEBHOOK_DEFAULT_SHEET = 'Submissions';

const MAIL_REQUIRED_SENDER_ACCOUNT = 'voicethecompanies@gmail.com';
const MAIL_ENFORCE_SENDER_ACCOUNT = false;
const MAIL_SENDER_NAME = 'Voice the Companies';
const MAIL_TRY_SEND_AS_REQUIRED_ACCOUNT = true;
const MAIL_TRIGGER_HANDLER = 'runAutomatedOwnerEmailJob';
const MAIL_TRIGGER_EVERY_MINUTES = 5;
const MAIL_ALLOWED_TRIGGER_MINUTES = [1, 5, 10, 15, 30];

const VTC_OPTIONAL_DATA_FORM_URL = 'https://forms.gle/X6YKriBykBpNe6C1A';

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: 'vtc-webhook', timestamp: new Date().toISOString() }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const payload = parseWebhookPayload_(e);
    const targetSheetName = resolveWebhookSheetName_(payload);
    const targetSheet = getOrCreateSheet_(targetSheetName);

    const flatData = flattenWebhookData_(payload);
    upsertHeaderColumns_(targetSheet, Object.keys(flatData));
    appendWebhookRow_(targetSheet, flatData);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, sheet: targetSheetName }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(error && error.message ? error.message : error) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function parseWebhookPayload_(e) {
  const raw = String((e && e.postData && e.postData.contents) || '').trim();
  if (!raw) {
    throw new Error('Empty webhook payload');
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (_jsonError) {
    const fallbackPayload = (e && e.parameter && (e.parameter.payload || e.parameter.data)) || '';
    if (!fallbackPayload) {
      throw new Error('Invalid JSON payload');
    }
    parsed = JSON.parse(fallbackPayload);
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Webhook payload must be an object');
  }

  return parsed;
}

function resolveWebhookSheetName_(payload) {
  const explicitHint = String(payload.sheet_tab_hint || '').trim();
  if (explicitHint) return explicitHint;

  const entity = String(payload.entity || '').trim();
  if (entity && WEBHOOK_SHEET_BY_ENTITY[entity]) {
    return WEBHOOK_SHEET_BY_ENTITY[entity];
  }

  return WEBHOOK_DEFAULT_SHEET;
}

function getOrCreateSheet_(sheetName) {
  const ss = getTargetSpreadsheet_();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  return sheet;
}

function getTargetSpreadsheet_() {
  const explicitId = String(TARGET_SPREADSHEET_ID || '').trim();
  if (explicitId) {
    return SpreadsheetApp.openById(explicitId);
  }

  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (!active) {
    throw new Error(
      'No active spreadsheet context. Set TARGET_SPREADSHEET_ID to your Google Sheet ID.'
    );
  }

  return active;
}

function flattenWebhookData_(payload) {
  const entity = String(payload.entity || '').trim();
  const submittedAt = String(payload.submitted_at || new Date().toISOString()).trim();
  const data = payload.data && typeof payload.data === 'object' ? payload.data : {};

  const out = {
    entity,
    submitted_at: submittedAt,
  };

  Object.keys(data).forEach((key) => {
    const value = data[key];
    out[key] = normalizeCellValue_(value);
  });

  return out;
}

function normalizeCellValue_(value) {
  if (value === null || typeof value === 'undefined') return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(value);
}

function upsertHeaderColumns_(sheet, requiredHeaders) {
  const lastColumn = sheet.getLastColumn();
  const existingHeaders = lastColumn
    ? sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map((v) => String(v || '').trim())
    : [];

  let nextColumn = existingHeaders.length + 1;
  requiredHeaders.forEach((header) => {
    if (existingHeaders.indexOf(header) !== -1) return;
    sheet.getRange(1, nextColumn).setValue(header);
    existingHeaders.push(header);
    nextColumn += 1;
  });
}

function appendWebhookRow_(sheet, record) {
  const headers = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0]
    .map((v) => String(v || '').trim());

  const row = headers.map((header) => {
    return Object.prototype.hasOwnProperty.call(record, header) ? record[header] : '';
  });

  sheet.appendRow(row);
}

function onOpen() {
  try {
    SpreadsheetApp.getUi()
      .createMenu('VTC Mail')
      .addItem('Enable Auto Email Scheduler', 'enableAutoEmailScheduler')
      .addItem('Disable Auto Email Scheduler', 'disableAutoEmailScheduler')
      .addItem('Run Scheduler Now', 'runAutomatedOwnerEmailJob')
      .addToUi();
  } catch (error) {
    Logger.log('Skipping onOpen UI setup outside spreadsheet UI context: %s', String(error));
  }
}

function enableAutoEmailScheduler() {
  ensureAutoEmailTrigger_();
}

function disableAutoEmailScheduler() {
  ScriptApp.getProjectTriggers().forEach((trigger) => {
    if (trigger.getHandlerFunction() === MAIL_TRIGGER_HANDLER) {
      ScriptApp.deleteTrigger(trigger);
    }
  });
}

function ensureAutoEmailTrigger_() {
  const exists = ScriptApp.getProjectTriggers().some(
    (trigger) => trigger.getHandlerFunction() === MAIL_TRIGGER_HANDLER
  );
  if (exists) return;

  const triggerEveryMinutes = MAIL_ALLOWED_TRIGGER_MINUTES.indexOf(MAIL_TRIGGER_EVERY_MINUTES) !== -1
    ? MAIL_TRIGGER_EVERY_MINUTES
    : 5;

  ScriptApp.newTrigger(MAIL_TRIGGER_HANDLER)
    .timeBased()
    .everyMinutes(triggerEveryMinutes)
    .create();
}

function runAutomatedOwnerEmailJob() {
  validateExecutionAccount_();
  sendPendingOwnerEmails_();
}

function validateExecutionAccount_() {
  const active = String(Session.getEffectiveUser().getEmail() || '').trim().toLowerCase();
  const required = MAIL_REQUIRED_SENDER_ACCOUNT.toLowerCase();

  if (active === required) return;

  if (MAIL_ENFORCE_SENDER_ACCOUNT) {
    throw new Error(
      'This scheduler must run as ' + MAIL_REQUIRED_SENDER_ACCOUNT +
      '. Current account is ' + (active || 'unknown') +
      '. Install the trigger while signed in as ' + MAIL_REQUIRED_SENDER_ACCOUNT + '.'
    );
  }

  Logger.log(
    'Running in development mode as %s. For production, set MAIL_ENFORCE_SENDER_ACCOUNT=true and install trigger as %s.',
    active || 'unknown',
    MAIL_REQUIRED_SENDER_ACCOUNT
  );
}

function sendPendingOwnerEmails_() {
  const sheet = getSheetOrThrow_(MAIL_SHEET_NAME);
  const data = sheet.getDataRange().getDisplayValues();
  if (data.length < 2) return;

  const headers = data[0];
  const recipientIdx = headers.indexOf(MAIL_RECIPIENT_COL);
  const statusIdx = ensureStatusColumn_(sheet, headers, MAIL_STATUS_COL);
  const ownerIdx = headers.indexOf(MAIL_OWNER_NAME_COL);
  const businessIdx = headers.indexOf(MAIL_BUSINESS_NAME_COL);

  if (recipientIdx === -1) {
    throw new Error('Missing required column: ' + MAIL_RECIPIENT_COL);
  }

  const out = [];

  for (let r = 1; r < data.length; r += 1) {
    const row = data[r];
    const existingStatus = String(row[statusIdx] || '').trim();
    const recipient = String(row[recipientIdx] || '').trim();

    if (existingStatus) {
      out.push([existingStatus]);
      continue;
    }

    if (!recipient || recipient.indexOf('@') === -1) {
      out.push(['Invalid or missing recipient']);
      continue;
    }

    try {
      const ownerName = ownerIdx >= 0 ? String(row[ownerIdx] || 'there').trim() : 'there';
      const businessName = businessIdx >= 0 ? String(row[businessIdx] || '').trim() : '';
      const subject = businessName
        ? 'VTC Optional Data Form - ' + businessName
        : 'VTC Optional Data Form';

      const textBody = [
        'Hi ' + ownerName + ',',
        '',
        'Please fill this short form for VTC data (optional):',
        VTC_OPTIONAL_DATA_FORM_URL,
        '',
        'Thank you,',
        'Voice the Companies',
      ].join('\n');

      const htmlBody =
        '<p>Hi ' + escapeHtml_(ownerName) + ',</p>' +
        '<p>Please fill this short form for VTC data (optional):</p>' +
        '<p><a href="' + VTC_OPTIONAL_DATA_FORM_URL + '">' + VTC_OPTIONAL_DATA_FORM_URL + '</a></p>' +
        '<p>Thank you,<br/>Voice the Companies</p>';

      const sentViaFallback = sendOwnerEmailBestEffort_(recipient, subject, textBody, htmlBody);
      if (sentViaFallback) {
        out.push(['Sent via fallback sender at ' + new Date().toISOString()]);
      } else {
        out.push([new Date()]);
      }
    } catch (error) {
      out.push([String(error && error.message ? error.message : error)]);
    }
  }

  sheet.getRange(2, statusIdx + 1, out.length, 1).setValues(out);
}

function getSheetOrThrow_(sheetName) {
  const sheet = getTargetSpreadsheet_().getSheetByName(sheetName);
  if (!sheet) {
    throw new Error('Sheet not found: ' + sheetName);
  }
  return sheet;
}

function ensureStatusColumn_(sheet, headers, statusColName) {
  const idx = headers.indexOf(statusColName);
  if (idx !== -1) return idx;

  const newColIndex = headers.length + 1;
  sheet.getRange(1, newColIndex).setValue(statusColName);
  return newColIndex - 1;
}

function escapeHtml_(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sendOwnerEmailBestEffort_(recipient, subject, textBody, htmlBody) {
  const baseOptions = {
    htmlBody,
    name: MAIL_SENDER_NAME,
    replyTo: MAIL_REQUIRED_SENDER_ACCOUNT,
  };

  if (!MAIL_TRY_SEND_AS_REQUIRED_ACCOUNT) {
    GmailApp.sendEmail(recipient, subject, textBody, baseOptions);
    return false;
  }

  try {
    GmailApp.sendEmail(recipient, subject, textBody, {
      ...baseOptions,
      from: MAIL_REQUIRED_SENDER_ACCOUNT,
    });
    return false;
  } catch (sendAsError) {
    Logger.log(
      'Send-as attempt failed for %s, falling back to active account sender. Error: %s',
      MAIL_REQUIRED_SENDER_ACCOUNT,
      String(sendAsError && sendAsError.message ? sendAsError.message : sendAsError)
    );
    GmailApp.sendEmail(recipient, subject, textBody, baseOptions);
    return true;
  }
}
