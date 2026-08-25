# DogsCBR Community Membership — Applicant Wizard

A self-serve replacement for DogsCBR's manual "email a Google Form back and
forth" Community Member onboarding, built for the Hack for Humanity 2026
Dogs Canberra challenge. Applicants complete induction, the OHS quiz, ID
verification, and e-signature entirely on their own; a staff member only
re-enters the loop for the supervised first walk.

## Stack

- **Frontend**: React + Vite + Tailwind CSS, Framer Motion for animation,
  `canvas-confetti` for the fun bits, `signature_pad` for the e-signature.
- **Backend**: Google Apps Script (see `backend/`) — writes to a Google
  Sheet, saves files to Drive, sends the two automated emails via Gmail.
  Zero servers, zero cost, matches the challenge's "use Google Workspace"
  brief directly.
- **Hosting**: Cloudflare Pages (free tier) for the static frontend.

## Local development

```bash
npm install
npm run dev
```

Without `VITE_APPS_SCRIPT_URL` set, submission falls back to a local mock so
the whole flow is demoable offline. See `backend/README.md` to deploy the
real backend and `.env.example` for wiring it up.

## Flow

1. **Landing** (`/`) — name, email, phone, DOB. Branches for under-18
   (guardian details) and accessibility notes, per DogsCBR's existing OHS
   rules — no sidebar here by design.
2. **`/apply/induction`** — DogsCBR's Community Induction Guide (rights,
   responsibilities, privacy policy) as an accordion.
3. **`/apply/ohs-guide`** — the OHS Guidelines as a swipeable card deck.
4. **`/apply/quiz`** — the OHS Program Test, one question at a time with
   instant feedback, hints sourced from the guidelines, and confetti on a
   correct answer. Unlimited retries, 100% required to proceed.
5. **`/apply/id-upload`** — photo ID upload (stored privately in Drive).
6. **`/apply/signature`** — digital signature on the Induction Form (added
   per DogsCBR staff's follow-up request).
7. **`/apply/confirmation`** — assigned Community Member number, plus a
   reminder that the first walk is staff-supervised.

Steps 2–7 share a left-hand sidebar (desktop) / top progress bar (mobile)
showing the whole journey — see `src/components/StepSidebar.jsx`.
