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

const MAIL_REQUIRED_SENDER_ACCOUNT = 'voicethecompanies@gmail.com';
const MAIL_ENFORCE_SENDER_ACCOUNT = false;
const MAIL_SENDER_NAME = 'Voice the Companies';
const MAIL_TRY_SEND_AS_REQUIRED_ACCOUNT = true;
const MAIL_TRIGGER_HANDLER = 'runAutomatedOwnerEmailJob';
const MAIL_TRIGGER_EVERY_MINUTES = 3;

const VTC_OPTIONAL_DATA_FORM_URL = 'https://forms.gle/X6YKriBykBpNe6C1A';

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('VTC Mail')
    .addItem('Enable Auto Email Scheduler', 'enableAutoEmailScheduler')
    .addItem('Disable Auto Email Scheduler', 'disableAutoEmailScheduler')
    .addItem('Run Scheduler Now', 'runAutomatedOwnerEmailJob')
    .addToUi();
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

  ScriptApp.newTrigger(MAIL_TRIGGER_HANDLER)
    .timeBased()
    .everyMinutes(MAIL_TRIGGER_EVERY_MINUTES)
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
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
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
