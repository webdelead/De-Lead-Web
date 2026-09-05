/**
 * De' Lead — lead capture for the DLI Education site (edu.deleadint.com).
 *
 * This is the site-specific copy of docs/apps-script/Code.gs. Behaviour is
 * identical except that every Sheet row and every notification email is clearly
 * stamped "De' Lead International website", so a lead from the parent/hub site is
 * never confused with one from Walk2Lead / MakerChamps / Corporate / DLI
 * Education (each of which has its own Sheet + its own deployment of this file
 * with its own SITE_LABEL).
 *
 * The admin dashboard (admin.deleadint.com) is still the source of truth — this
 * script is a per-site BACKUP + NOTIFIER for the same JSON payload.
 *
 * SETUP (once):
 *   1. Open the "De Lead Int Leads" Google Sheet → Extensions → Apps Script.
 *      Paste this file. Keep the Apps Script project name the same as the other
 *      sites ("De' Lead — lead capture") so all six read consistently.
 *   2. Deploy → New deployment → type "Web app"
 *        Execute as: Me      ·      Who has access: Anyone
 *   3. Copy the /exec URL → set it as APPS_SCRIPT_URL_DLI_EDUCATION in:
 *        - De Lead Web/.env                    (real value)
 *        - De Lead Web/apps/dashboard  Vercel env vars
 *        - (optional, for local testing) apps/dashboard/.env.local
 *   4. Redeploy the dashboard so it picks up the new var.
 *
 * To change the email recipients without redeploying, set a Script Property
 * named NOTIFY (Project Settings → Script properties) to a comma-separated list.
 */

var SITE_LABEL = "DLI Education";
var SITE_URL = "https://edu.deleadint.com";
var DEFAULT_NOTIFY_TO = "webdelead@gmail.com"; // TODO: info@deleadint.com, arjun@deleadint.com
var SHEET_NAME = "Submissions";

function doPost(e) {
  try {
    var payload = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    var sheet = getSheet_();
    var keys = orderedKeys_(payload);

    // header row on first write — "site" column first so the Sheet is unambiguous
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["received_at", "site"].concat(keys));
    }

    var now = new Date();
    var row = [now, SITE_LABEL];
    for (var i = 0; i < keys.length; i++) {
      var v = payload[keys[i]];
      row.push(v == null ? "" : String(v));
    }
    sheet.appendRow(row);

    notify_(payload, now);

    return json_({ ok: true, site: SITE_LABEL });
  } catch (err) {
    // still return 200 so the site's submit UX isn't blocked; log for debugging
    console.error(err);
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json_({ ok: true, service: "delead-lead-capture", site: SITE_LABEL });
}

/* ---------- helpers ---------- */

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  return sheet;
}

function notifyTo_() {
  var prop = PropertiesService.getScriptProperties().getProperty("NOTIFY");
  return (prop && prop.trim()) || DEFAULT_NOTIFY_TO;
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
    if (
      Object.prototype.hasOwnProperty.call(payload, k) &&
      keys.indexOf(k) === -1 &&
      k !== "receivedAt"
    ) {
      keys.push(k);
    }
  }
  return keys;
}

function notify_(payload, when) {
  var who =
    payload.name || payload.parentName || payload.studentName || "New enquiry";
  var subject = "New enquiry — " + SITE_LABEL + " website: " + who;

  var lines = [
    "A new enquiry came in through the " + SITE_LABEL + " website (" + SITE_URL + ").",
    "Received: " + when,
    "",
  ];
  var keys = orderedKeys_(payload);
  for (var i = 0; i < keys.length; i++) {
    var label = keys[i]
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, function (c) { return c.toUpperCase(); });
    var val = payload[keys[i]];
    if (val != null && String(val) !== "") lines.push(label + ": " + val);
  }
  lines.push(
    "",
    "Site: " + SITE_LABEL,
    "— logged to the " + SITE_LABEL + " Google Sheet, and to the dashboard at admin.deleadint.com",
  );

  MailApp.sendEmail({
    to: notifyTo_(),
    subject: subject,
    body: lines.join("\n"),
  });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
