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

const TAB_HEADERS = {
  [TAB_OWNERS]: ['submitted_at', 'entity', 'id', 'business_name', 'owner_name', 'email', 'phone', 'business_type', 'website_exists', 'services_needed', 'additional_info', 'created_date', 'updated_date'],
  [TAB_STUDENTS]: ['submitted_at', 'entity', 'id', 'full_name', 'email', 'phone', 'school', 'grade_level', 'interests', 'experience', 'why_interested', 'created_date', 'updated_date'],
  [TAB_WORKSHOPS]: ['submitted_at', 'entity', 'id', 'name', 'email', 'workshop_title', 'workshop_timing', 'workshop_format', 'workshop_duration', 'subject', 'message', 'status', 'created_date', 'updated_date'],
  [TAB_BEFORE_AFTER]: ['submitted_at', 'entity', 'id', 'business_name', 'owner_email', 'period_label', 'website_sessions', 'unique_visitors', 'social_followers', 'social_reach', 'google_profile_views', 'google_direction_requests', 'confidence_website', 'confidence_social', 'confidence_analytics', 'notes', 'created_date', 'updated_date'],
};

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
    ensureTabsExist_();

    const sheet = getOrCreateSheet_(tabName);
    const headers = TAB_HEADERS[tabName];
    ensureHeader_(sheet, headers);

    const row = headers.map((key) => {
      if (key === 'submitted_at') return submittedAt;
      if (key === 'entity') return entity;
      const value = data[key];
      if (value === null || typeof value === 'undefined') return '';
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
  [TAB_OWNERS, TAB_STUDENTS, TAB_WORKSHOPS, TAB_BEFORE_AFTER].forEach((name) => {
    getOrCreateSheet_(name);
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
