# Backend — Google Apps Script

Zero-cost, zero-server backend that writes straight into DogsCBR's own Google
Workspace: a Sheet for the Community Members Register, Drive folders for ID
photos and signed induction forms, and Gmail for the two automated emails
(staff summary + applicant confirmation).

## Deploy (5 minutes)

Two ways to set this up — pick one:

**Option A — bound to the Sheet (recommended):** create/open the Google Sheet
you want to use as the Community Members Register, then go to
**Extensions → Apps Script** from inside it. This creates a script that's
automatically wired to that Sheet.

**Option B — standalone (if you started from script.google.com directly):**
open the target Google Sheet, copy its ID out of the URL
(`.../spreadsheets/d/`**`THIS_PART`**`/edit`), and paste it into the
`SHEET_ID` constant near the top of `Code.gs`.

Either way:

1. Delete the placeholder `Code.gs` content and paste in this folder's
   `Code.gs`.
2. Update the constants at the top of the file:
   - `SHEET_ID` — only needed for Option B, see above.
   - `STAFF_EMAIL` — the inbox that should receive new-application summaries.
   - `CM_NUMBER_START` — where numbering should begin (matches whatever your
     existing register is currently up to, so numbers don't collide).
3. Open **Project Settings → Script Properties**, add a property named
   `GEMINI_API_KEY`, and paste the key from Google AI Studio as its value. Do
   not put this key in the frontend `.env` or in `Code.gs`.
4. Click **Deploy → New deployment → Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
   - You'll hit a **"Google hasn't verified this app"** screen when
     authorizing — that's expected for any personal script requesting
     Gmail/Drive access, not an error. Click **Advanced → Go to (project
     name) (unsafe)** → **Allow**. It's safe: this is code you (or your
     teammate) wrote, running under your own account — nothing is sent
     anywhere else.
5. Copy the deployment URL (ends in `/exec`) into the frontend's `.env` as
   `VITE_APPS_SCRIPT_URL`.
6. Send a test application through the site and check: a new row appears in
   a "Register" tab, files land in the "Community Member IDs" and "Signed
   Induction Forms" Drive folders, and both emails arrive.

If this web app is already deployed and you change `Code.gs`, use **Deploy →
Manage deployments → Edit → New version → Deploy**. The existing `/exec` URL
continues to work. Changing only the `GEMINI_API_KEY` Script Property later
does not require another version because the deployed code reads it at runtime.

## Notes

- The script auto-creates the `Register` sheet tab and both Drive folders on
  first run if they don't already exist.
- Free Gmail accounts cap Apps Script sends at ~100/day. If DogsCBR is
  approved for [Google for Nonprofits](https://www.google.com/nonprofits/),
  moving this script into that Workspace account raises that ceiling
  significantly — no code changes needed.
- ID photos and signatures are stored in Drive folders that default to
  private (view-only, no public link). Restrict folder sharing to
  DogsCBR staff in Drive's sharing settings.
