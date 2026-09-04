# Staff Setup Guide — Google Apps Script Backend

Zero-cost, zero-server backend that writes straight into DogsCBR's own Google
Workspace: a Sheet for the Community Members Register, Drive folders for ID
photos and signed induction forms, and Gmail for the two automated emails
(staff summary + applicant confirmation).

## What you'll end up with

Just one Google Sheet — everything else is created automatically the first
time someone applies:

- A **`Register`** tab in that Sheet, with the header row already filled in
- A **`Community Member IDs`** folder in Drive (photo ID uploads)
- A **`Signed Induction Forms`** folder in Drive (signed e-signature PDFs)

You don't need to build any of these by hand. Just create the Sheet, deploy
the script, and the rest appears on its own the first time it runs.

## Deploy (5 minutes)

**Step 0 — create the Sheet.** Go to [sheets.google.com](https://sheets.google.com),
click **Blank spreadsheet**, and rename it to something like "DogsCBR
Community Members Register" (top-left, click the title). That's the only
manual setup step — leave it empty otherwise, the script fills in the rest.

Two ways to connect the script to it — pick one:

**Option A — bound to the Sheet (recommended):** from inside the Sheet you
just created, go to **Extensions → Apps Script**. This creates a script
that's automatically wired to that Sheet.

**Option B — standalone (if you started from script.google.com directly):**
open the target Google Sheet, copy its ID out of the URL
(`.../spreadsheets/d/`**`THIS_PART`**`/edit`), and paste it into the
`SHEET_ID` constant near the top of `Code.gs`.

Either way:

1. Delete the placeholder `Code.gs` content and paste in this folder's
   `Code.gs`.
2. Update the constants at the top of the file:
   - `SHEET_ID` — only needed for Option B, see above.
   - `STAFF_EMAIL` — **currently set to the placeholder `staff@example.org`.
     Replace it with DogsCBR's real staff inbox before deploying.
     development. Change this to DogsCBR's real staff inbox before going
     live**, or every new-application summary will keep landing in the
     wrong mailbox.
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
     <<<<<<< HEAD
     name) (unsafe)** → **Allow**. It's safe: this is code you (or your
     teammate) wrote, running under your own account — nothing is sent
     anywhere else.
5. Copy the deployment URL (ends in `/exec`) into the frontend's `.env` as
   `VITE_APPS_SCRIPT_URL`.
6. Send a test application through the site and check: a new row appears in
   a "Register" tab, files land in the "Community Member IDs" and "Signed
   Induction Forms" Drive folders, and both emails arrive.
   =======
   name) (unsafe)** → **Allow\*\*. Only continue if you trust and have reviewed this repository's Apps Script
   source. Confirm the requested Gmail, Drive and Sheets permissions before
   authorising it.
7. Copy the deployment URL (ends in `/exec`). Add it in two places, since
   local dev and the live site read it separately:
   - Locally: paste it into `.env` as `VITE_APPS_SCRIPT_URL` (copy
     `.env.example` if you don't have a `.env` yet).
   - Live site: in the Cloudflare dashboard, open the Pages project →
     **Settings → Environment variables**, add `VITE_APPS_SCRIPT_URL` with
     the same value for both **Production** and **Preview**, then go to
     **Deployments** and **Retry deployment** on the latest one (or just
     push a commit) — Cloudflare only picks up a new environment variable
     on the _next_ build, not retroactively.
8. Send a test application through the site (local or live) and check: a
   new row appears in the `Register` tab, files land in the "Community
   Member IDs" and "Signed Induction Forms" Drive folders, and both emails
   arrive.

If this web app is already deployed and you change `Code.gs`, use **Deploy →
Manage deployments → Edit → New version → Deploy**. The existing `/exec` URL
continues to work. Changing only the `GEMINI_API_KEY` Script Property later
does not require another version because the deployed code reads it at runtime.

## Where to check things day-to-day

Once it's live, this is where everything ends up — no separate admin panel:

| Looking for…                                      | Where                                                                                             |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| A new applicant's details                         | The `Register` tab in the Google Sheet                                                            |
| Their uploaded photo ID                           | Drive → `Community Member IDs`                                                                    |
| Their signed induction form                       | Drive → `Signed Induction Forms`                                                                  |
| The notification email                            | Whatever inbox `STAFF_EMAIL` points to                                                            |
| Whether an email actually sent, or why one failed | Apps Script editor → clock icon on the left (**Executions**) → click the most recent `doPost` run |

> > > > > > > ec66d43 (update README and backend README)

If this web app is already deployed and you change `Code.gs`, use **Deploy →
Manage deployments → Edit → New version → Deploy**. The existing `/exec` URL
continues to work. Changing only the `GEMINI_API_KEY` Script Property later
does not require another version because the deployed code reads it at runtime.

## Notes

- Free Gmail accounts cap Apps Script sends at ~100/day. If DogsCBR is
  approved for [Google for Nonprofits](https://www.google.com/nonprofits/),
  moving this script into that Workspace account raises that ceiling
  significantly — no code changes needed.
- ID photos and signatures are stored in Drive folders that default to
  private (view-only, no public link). Restrict folder sharing to
  DogsCBR staff in Drive's sharing settings.
