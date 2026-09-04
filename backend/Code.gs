/**
 * DogsCBR Community Member application backend.
 * Deploy as a Web App (Execute as: Me, Access: Anyone). Bind this script to the
 * Community Members Register spreadsheet so SpreadsheetApp.getActiveSpreadsheet()
 * resolves without an ID.
 *
 * Sheet expected: a tab named "Register" with header row:
 * Timestamp | CM Number | Full Name | Email | Phone | DOB | Is Minor |
 * Guardian Name | Guardian Contact | Accessibility Notes | Quiz Score |
 * Quiz Attempts | ID File | Signature File | Induction Accepted
 */

// Just the ID segment, not the full URL: docs.google.com/spreadsheets/d/<THIS_PART>/edit
// Only needed for a standalone script (i.e. not created via Extensions → Apps Script from inside the Sheet).
const SHEET_ID = "";
const SHEET_NAME = "Register";
const ID_FOLDER_NAME = "Community Member IDs";
const SIGNATURE_FOLDER_NAME = "Signed Induction Forms";
const STAFF_EMAIL = "staff@example.org"; // TODO: set to the real DogsCBR staff inbox before deploying
const CM_NUMBER_PREFIX = "CM";
const CM_NUMBER_START = 1001;

// Add GEMINI_API_KEY under Project Settings → Script Properties. Keeping the
// secret out of this source file prevents it being committed to Git.
const GEMINI_API_KEY_PROPERTY = "GEMINI_API_KEY";
const GEMINI_MODEL = "gemini-2.5-flash";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.action === "ask") {
      return jsonResponse_({ ok: true, answer: askGuidelines_(data.question) });
    }

    const cmNumber = generateCmNumber_();

    const idFileUrl = data.idFile ? saveDataUrlToDrive_(data.idFile, ID_FOLDER_NAME, cmNumber) : "";
    const signatureUrl = data.signature
      ? saveDataUrlToDrive_({ name: `${cmNumber}-signature.png`, dataUrl: data.signature }, SIGNATURE_FOLDER_NAME, cmNumber)
      : "";

    appendRow_(cmNumber, data, idFileUrl, signatureUrl);
    sendStaffSummaryEmail_(cmNumber, data, idFileUrl, signatureUrl);
    sendApplicantConfirmationEmail_(cmNumber, data);

    return jsonResponse_({ ok: true, cmNumber });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}

// Kept in sync with src/lib/guideCards.js by hand — short enough to just paste inline.
const OHS_GUIDELINES_TEXT = `
- Medical emergency: tell staff immediately, they carry a First Aid kit.
- Signing in: hand your photo ID to staff before the walk, collect it when you return the dog.
- Footwear: fully enclosed, non-slip shoes, every walk.
- Water: bring your own; on walks over 60 minutes, offer the dog water every 30 minutes.
- Sun protection: wear a hat, Canberra sun is strong.
- Under 18s: must walk with an accompanying adult Community Member, sharing one lead at all times.
- Where to walk: public areas or DogsCBR's recommended routes only.
- Distance from other dogs: at least 10 metres.
- Lead handling: loop it securely around your wrist and grip it; never detach the lead or remove the harness.
- Waste: pick up with provided bags, bin it in any public bin.
- Stay reachable: always carry your phone.
- Loose harness: don't fix it yourself, find a staff member.
- If the dog tries to eat something: gently move it away and contact staff, don't grab or forcefully tug.
`;

function askGuidelines_(question) {
  const apiKey = PropertiesService.getScriptProperties().getProperty(GEMINI_API_KEY_PROPERTY);
  if (!apiKey || !question) {
    return "I can't look that up right now — best to check the guide cards above, or ask a DogsCBR staff member.";
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const prompt =
    "You are a friendly dog, speaking in first person, helping a new DogsCBR volunteer understand the walking " +
    "OHS guidelines below. Answer ONLY using these guidelines, in 2-3 short sentences. If the question isn't " +
    "answered by them, say you're not sure and suggest asking a staff member — don't make anything up.\n\n" +
    "GUIDELINES:\n" + OHS_GUIDELINES_TEXT + "\n\nQUESTION: " + question;

  const res = UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    muteHttpExceptions: true,
  });

  const body = JSON.parse(res.getContentText());
  const text = body?.candidates?.[0]?.content?.parts?.[0]?.text;
  return text ? text.trim() : "I couldn't quite fetch an answer for that — try asking a staff member.";
}

function doGet() {
  return jsonResponse_({ ok: true, message: "DogsCBR membership API is running." });
}

function generateCmNumber_() {
  const sheet = getSheet_();
  const lastRow = sheet.getLastRow();
  const n = CM_NUMBER_START + Math.max(0, lastRow - 1); // -1 for header row
  return `${CM_NUMBER_PREFIX}${n}`;
}

function getSpreadsheet_() {
  return SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
}

function getSheet_() {
  const ss = getSpreadsheet_();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "Timestamp", "CM Number", "Full Name", "Email", "Phone", "DOB", "Is Minor",
      "Guardian Name", "Guardian Contact", "Accessibility Notes", "Quiz Score",
      "Quiz Attempts", "ID File", "Signature File", "Induction Accepted",
    ]);
  }
  return sheet;
}

function appendRow_(cmNumber, data, idFileUrl, signatureUrl) {
  getSheet_().appendRow([
    new Date(),
    cmNumber,
    data.fullName || "",
    data.email || "",
    data.phone || "",
    data.dob || "",
    data.isMinor ? "Yes" : "No",
    data.guardianName || "",
    data.guardianContact || "",
    data.accessibilityNotes || "",
    `${data.quiz?.score ?? ""}/${data.quiz?.total ?? ""}`,
    data.quiz?.attempts ?? "",
    idFileUrl,
    signatureUrl,
    data.inductionAccepted ? "Yes" : "No",
  ]);
}

function getOrCreateFolder_(name) {
  const existing = DriveApp.getFoldersByName(name);
  if (existing.hasNext()) return existing.next();
  return DriveApp.createFolder(name);
}

function saveDataUrlToDrive_(file, folderName, cmNumber) {
  const folder = getOrCreateFolder_(folderName);
  const match = /^data:(.+);base64,(.*)$/.exec(file.dataUrl);
  if (!match) return "";
  const [, mimeType, base64] = match;
  const bytes = Utilities.base64Decode(base64);
  const blob = Utilities.newBlob(bytes, mimeType, `${cmNumber}-${file.name || "upload"}`);
  const created = folder.createFile(blob);
  created.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.VIEW);
  return created.getUrl();
}

function sendStaffSummaryEmail_(cmNumber, data, idFileUrl, signatureUrl) {
  const subject = `New Community Member application — ${data.fullName} (${cmNumber})`;
  const body = [
    `A new DogsCBR Community Member application has come in and been auto-approved to the point of issuing a number. Details below for your records / spot-check.`,
    ``,
    `Community Member Number: ${cmNumber}`,
    `Name: ${data.fullName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Date of birth: ${data.dob}${data.isMinor ? "  (under 18)" : ""}`,
    data.isMinor ? `Accompanying adult: ${data.guardianName} — ${data.guardianContact}` : "",
    data.accessibilityNotes ? `Accessibility notes: ${data.accessibilityNotes}` : "",
    ``,
    `OHS Quiz: ${data.quiz?.score ?? "?"}/${data.quiz?.total ?? "?"} correct on first try, ${data.quiz?.attempts ?? 0} total retry attempts across all questions.`,
    `Induction accepted: ${data.inductionAccepted ? "Yes" : "No"}`,
    `Signed name: ${data.signedName}`,
    idFileUrl ? `ID file: ${idFileUrl}` : "",
    signatureUrl ? `Signature: ${signatureUrl}` : "",
    ``,
    `Submitted: ${data.submittedAt}`,
  ].filter(Boolean).join("\n");

  GmailApp.sendEmail(STAFF_EMAIL, subject, body);
}

function sendApplicantConfirmationEmail_(cmNumber, data) {
  const subject = "You're Officially Part of the Dogs Canberra Walking Program!";
  const body = [
    `Hi ${data.fullName.split(" ")[0]},`,
    ``,
    `Thank you for completing the OHS Program Test and signing your Community Induction Form — we're thrilled to officially welcome you to the Dogs Canberra Walking Program!`,
    ``,
    `You've now been assigned your Community Member ID: ${cmNumber}`,
    ``,
    `Please keep this ID handy, as you'll need to provide it when booking walks online.`,
    ``,
    `Your very first walk is always supervised by a DogsCBR staff member — after that, you're free to book walks solo. Head to www.dogscbr.org, then Help a Dog, and click Walk Me on any available dog.`,
    ``,
    `If you have any questions or need support at any point, don't hesitate to reach out.`,
    ``,
    `Warm regards,`,
    `The Dogs Canberra Team`,
    `www.dogscbr.org`,
  ].join("\n");

  GmailApp.sendEmail(data.email, subject, body);
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
