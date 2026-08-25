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

const SHEET_NAME = "Register";
const ID_FOLDER_NAME = "Community Member IDs";
const SIGNATURE_FOLDER_NAME = "Signed Induction Forms";
const STAFF_EMAIL = "x85561@gmail.com"; // TODO: swap for the real DogsCBR staff inbox before going live
const CM_NUMBER_PREFIX = "CM";
const CM_NUMBER_START = 1001;

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
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

function doGet() {
  return jsonResponse_({ ok: true, message: "DogsCBR membership API is running." });
}

function generateCmNumber_() {
  const sheet = getSheet_();
  const lastRow = sheet.getLastRow();
  const n = CM_NUMBER_START + Math.max(0, lastRow - 1); // -1 for header row
  return `${CM_NUMBER_PREFIX}${n}`;
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
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
  const subject = "You're Officially Part of the Dogs Canberra Walking Program! 🐾";
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
