/**
 * De' Lead — lead / booking capture for one site's Google Sheet.
 *
 * The admin dashboard (admin.deleadint.com) is the source of truth; this script
 * is a per-site BACKUP + NOTIFIER. It receives the same JSON payload, appends a
 * row to this spreadsheet, and emails the team.
 *
 * SETUP (once per site — each site gets its own Sheet + its own deployment):
 *   1. Create a new Google Sheet. Extensions → Apps Script. Paste this file.
 *   2. Edit NOTIFY_TO below if needed.
 *   3. Deploy → New deployment → type "Web app"
 *        Execute as: Me
 *        Who has access: Anyone
 *   4. Copy the /exec URL → paste into De Lead Web/.env as
 *        APPS_SCRIPT_URL_<SITE>   (e.g. APPS_SCRIPT_URL_WALK2LEAD)
 *      and into the dashboard's Vercel env vars.
 *   5. Re-deploy the dashboard so it picks up the new var.
 */

var NOTIFY_TO = "info@deleadint.com,arjun@deleadint.com";
var SHEET_NAME = "Submissions";

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents || "{}");
    var sheet = getSheet_();
    var keys = orderedKeys_(payload);

    // header row on first write
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["received_at"].concat(keys));
    }

    var now = new Date();
    var row = [now];
    for (var i = 0; i < keys.length; i++) {
      var v = payload[keys[i]];
      row.push(v == null ? "" : String(v));
    }
    sheet.appendRow(row);

    notify_(payload, now);

    return json_({ ok: true });
  } catch (err) {
    // still return 200 so the site's submit UX isn't blocked; log for debugging
    console.error(err);
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json_({ ok: true, service: "delead-lead-capture" });
}

/* ---------- helpers ---------- */

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  return sheet;
}

// keep a sensible column order; unknown keys are appended in payload order
function orderedKeys_(payload) {
  var preferred = [
    "source", "name", "parentName", "studentName", "classGrade",
    "email", "phone", "interest", "place", "message", "pagePath",
  ];
  var keys = [];
  for (var i = 0; i < preferred.length; i++) {
    if (Object.prototype.hasOwnProperty.call(payload, preferred[i])) keys.push(preferred[i]);
  }
  for (var k in payload) {
    if (Object.prototype.hasOwnProperty.call(payload, k) && keys.indexOf(k) === -1 && k !== "receivedAt") {
      keys.push(k);
    }
  }
  return keys;
}

function notify_(payload, when) {
  var src = payload.source || "website";
  var who = payload.name || payload.parentName || payload.studentName || "New enquiry";
  var subject = "New " + src + " enquiry: " + who;

  var lines = ["A new submission came in on " + when + ".", ""];
  var keys = orderedKeys_(payload);
  for (var i = 0; i < keys.length; i++) {
    var label = keys[i].replace(/([A-Z])/g, " $1").replace(/^./, function (c) { return c.toUpperCase(); });
    var val = payload[keys[i]];
    if (val != null && String(val) !== "") lines.push(label + ": " + val);
  }
  lines.push("", "— logged to this site's Google Sheet, and to the dashboard at admin.deleadint.com");

  MailApp.sendEmail({
    to: NOTIFY_TO,
    subject: subject,
    body: lines.join("\n"),
  });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
