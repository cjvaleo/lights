/**
 * TR Lights — quote request receiver.
 *
 * Receives quote requests from the wizard on trlightsnj.com and appends
 * one row per lead to a Google Sheet.
 *
 * Deploy: Extensions > Apps Script, paste this file, then
 * Deploy > New deployment > Web app > Execute as: Me, Who has access: Anyone.
 * Copy the /exec URL into SHEET_URL in index.html.
 * Full walkthrough in README.md next to this file.
 */

// Leave '' when this script is bound to the Sheet (Extensions > Apps Script).
// Otherwise paste the Sheet ID from its URL: docs.google.com/spreadsheets/d/<ID>/edit
var SHEET_ID = '';

var TAB_NAME = 'Leads';

// Optional: get an email the moment a lead comes in. '' turns notifications off.
var NOTIFY_EMAIL = '';

var HEADERS = ['Timestamp', 'Name', 'Phone', 'Email', 'Address', 'Where',
               'Colors', 'Bushes', 'Trees', 'Extras est. ($)', 'Discount ($)', 'Source'];

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) return json({ ok: false, error: 'No data' });

    var d = JSON.parse(e.postData.contents);

    // One writer at a time, so two people submitting together can't land on the same row.
    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      sheet().appendRow([
        new Date(),
        str(d.name), str(d.phone), str(d.email), str(d.address),
        str(d.where), str(d.colors),
        num(d.bushes), num(d.trees), num(d.extrasEstimate), num(d.discount),
        str(d.source)
      ]);
    } finally {
      lock.releaseLock();
    }

    notify(d);
    return json({ ok: true });
  } catch (err) {
    // Logged to Apps Script > Executions so a failed lead is still traceable.
    console.error(err);
    return json({ ok: false, error: String(err) });
  }
}

// Visiting the /exec URL in a browser should confirm the endpoint is live.
function doGet() {
  return json({ ok: true, message: 'TR Lights quote endpoint is live.' });
}

function sheet() {
  var ss = SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('No spreadsheet. Bind the script to a Sheet or set SHEET_ID.');

  var sh = ss.getSheetByName(TAB_NAME);
  if (!sh) {
    sh = ss.insertSheet(TAB_NAME);
  }
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function notify(d) {
  if (!NOTIFY_EMAIL) return;
  try {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: 'New TR Lights quote request — ' + str(d.name),
      body: [
        'Name:    ' + str(d.name),
        'Phone:   ' + str(d.phone),
        'Email:   ' + str(d.email),
        'Address: ' + str(d.address),
        '',
        'Where:   ' + str(d.where),
        'Colors:  ' + str(d.colors),
        'Bushes:  ' + num(d.bushes),
        'Trees:   ' + num(d.trees),
        '',
        'Extras estimate: $' + num(d.extrasEstimate) + ' (extras only — roofline priced after measuring)',
        'Discount earned: $' + num(d.discount)
      ].join('\n')
    });
  } catch (err) {
    console.error('Notify failed: ' + err); // never fail the save over an email
  }
}

function str(v) { return v == null ? '' : String(v); }
function num(v) { var n = Number(v); return isNaN(n) ? 0 : n; }

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
