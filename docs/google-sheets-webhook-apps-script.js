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
const COMPANY_NAME = 'Voice the Companies';
const COMPANY_EMAIL = 'voicethecompanies@gmail.com';
const COMPANY_FROM_ALIAS = '';

function getAdminEmail_() {
  try {
    const email = Session.getEffectiveUser().getEmail();
    return email || COMPANY_EMAIL;
  } catch (e) {
    return COMPANY_EMAIL;
  }
}
const BASELINE_FORM_URL = 'https://forms.gle/X6YKriBykBpNe6C1A';

const TAB_HEADERS = {
  [TAB_OWNERS]: ['submitted_at', 'entity', 'id', 'business_name', 'owner_name', 'email', 'phone', 'business_type', 'website_exists', 'services_needed', 'additional_info', 'created_date', 'updated_date'],
  [TAB_STUDENTS]: ['submitted_at', 'entity', 'id', 'full_name', 'email', 'phone', 'school', 'grade_level', 'interests', 'experience', 'why_interested', 'created_date', 'updated_date'],
  [TAB_WORKSHOPS]: ['submitted_at', 'entity', 'id', 'name', 'email', 'workshop_title', 'workshop_timing', 'workshop_format', 'workshop_duration', 'subject', 'message', 'status', 'created_date', 'updated_date'],
  [TAB_BEFORE_AFTER]: ['submitted_at', 'entity', 'id', 'business_name', 'owner_email', 'period_label', 'website_sessions', 'unique_visitors', 'social_followers', 'social_reach', 'google_profile_views', 'google_direction_requests', 'confidence_website', 'confidence_social', 'confidence_analytics', 'notes', 'created_date', 'updated_date'],
};

const SHEET_DATE_FORMAT = 'MMM d, yyyy h:mm a';

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: 'vtc-webhook', status: 'ready' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const body = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
    const payload = JSON.parse(body);

    const entity = String(payload.entity || '').trim();
    const submittedAt = String(payload.submitted_at || new Date().toISOString());
    const data = (payload && typeof payload.data === 'object' && payload.data) ? payload.data : {};

    const tabName = resolveTabName(entity, data, payload.sheet_tab_hint);
    const sheet = getExistingSheet_(tabName);
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
    sendNotificationEmail_(entity, data, submittedAt, tabName);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, tab: tabName }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(error && error.message ? error.message : error) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendNotificationEmail_(entity, data, submittedAt, tabName) {
  const formattedTime = formatTimestampForSheet_(submittedAt);
  const summary = [
    `Entity: ${entity}`,
    `Sheet tab: ${tabName}`,
    `Submitted: ${formattedTime}`,
    '',
    `Payload: ${JSON.stringify(data, null, 2)}`,
  ].join('\n');

  try {
    sendEmailFromCompany_(getAdminEmail_(), `New ${entity} submission`, summary);
  } catch (error) {
    // Keep webhook successful even if admin email delivery fails.
    console.log('Admin email notification failed', String(error));
  }

  const isOwnerSubmission = tabName === TAB_OWNERS || entity === 'BusinessRequest';
  if (isOwnerSubmission) {
    const ownerEmail = getOwnerEmail_(data);
    if (!ownerEmail) return;

    try {
      const ownerSubject = `Action Requested: Optional Profit Baseline Form${data.business_name ? ` (${data.business_name})` : ''}`;
      const ownerBody = `Hi ${data.owner_name || 'there'},\n\nThanks for submitting your business request.\n\nPlease complete your optional baseline form here:\n${BASELINE_FORM_URL}\n\nThis gives us your starting point so we can compare before/after outcomes later.\n\nSubmitted: ${formattedTime}\n\nThank you,\nVoice the Companies`;

      sendEmailFromCompany_(
        ownerEmail,
        ownerSubject,
        ownerBody
      );

      // Delivery trace so the deployer can verify owner-send branch executed.
      sendEmailFromCompany_(
        getAdminEmail_(),
        `[Owner Email Sent] ${ownerSubject}`,
        `Owner baseline email sent successfully.\n\nOwner recipient: ${ownerEmail}\nEntity: ${entity}\nTab: ${tabName}\nSubmitted: ${formattedTime}`
      );
    } catch (error) {
      // Keep webhook successful even if owner email delivery fails.
      console.log('Owner baseline email failed', String(error));
      try {
        sendEmailFromCompany_(
          getAdminEmail_(),
          '[Owner Email Failed] Optional Profit Baseline Form',
          `Owner baseline email failed.\n\nOwner recipient: ${ownerEmail}\nEntity: ${entity}\nTab: ${tabName}\nSubmitted: ${formattedTime}\nError: ${String(error)}`
        );
      } catch (_) {
        // Do not throw from diagnostics.
      }
    }
  }
}

function getOwnerEmail_(data) {
  return String(
    (data && (data.email || data.owner_email || data.ownerEmail || data.contact_email)) || ''
  ).trim();
}

function sendEmailFromCompany_(to, subject, body) {
  const recipient = String(to || '').trim();
  if (!recipient) throw new Error('Missing recipient email');

  const options = {
    name: COMPANY_NAME,
    replyTo: COMPANY_EMAIL,
  };

  if (COMPANY_FROM_ALIAS) {
    try {
      GmailApp.sendEmail(recipient, subject, body, { ...options, from: COMPANY_FROM_ALIAS });
      return;
    } catch (error) {
      console.log('Company alias send failed; falling back', String(error));
    }
  }

  MailApp.sendEmail({
    to: recipient,
    subject,
    body,
    name: COMPANY_NAME,
    replyTo: COMPANY_EMAIL,
  });
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

function getExistingSheet_(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(name);
  if (!sheet) {
    throw new Error('Missing required tab: ' + name);
  }
  return sheet;
}

/**
 * Run this function manually from the Apps Script editor to:
 * 1. Authorize MailApp permissions (required on first run)
 * 2. Confirm emails are actually being delivered
 * After running, check voicethecompanies@gmail.com inbox for the test message.
 */
function testEmailDelivery() {
  const testRecipient = getAdminEmail_();
  const timestamp = new Date().toLocaleString();
  try {
    MailApp.sendEmail({
      to: testRecipient,
      subject: 'VTC Apps Script email test - ' + timestamp,
      body: 'This is a test email from the Voice the Companies Apps Script webhook.\n\nIf you received this, MailApp is authorized and working correctly.\n\nSent: ' + timestamp,
      name: COMPANY_NAME,
      replyTo: COMPANY_EMAIL,
    });
    Logger.log('Test email sent successfully to ' + testRecipient);
  } catch (error) {
    Logger.log('Test email FAILED: ' + String(error));
    throw error;
  }
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
