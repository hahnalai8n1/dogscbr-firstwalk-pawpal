<div align="center">

# 🐾 PawPal

**A self-serve Community Member onboarding portal for [Dogs Canberra](https://www.dogscbr.org)**

Turns a manual, email-heavy sign-up process into a guided flow applicants complete on their own — a staff member only re-enters the loop for the supervised first walk.

Built by **Team Tian³** for AI Collective Canberra's **Hack for Humanity 2026**.

![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-010781?style=flat&labelColor=FFF5DF&logo=react&logoColor=087EA4)
![Styling](https://img.shields.io/badge/Styling-Tailwind%20CSS-010781?style=flat&labelColor=FFF5DF&logo=tailwindcss&logoColor=0891B2)
![Animation](https://img.shields.io/badge/Animation-Framer%20Motion-010781?style=flat&labelColor=FFF5DF&logo=framer&logoColor=111827)
![Backend](https://img.shields.io/badge/Backend-Google%20Apps%20Script-010781?style=flat&labelColor=FFF5DF&logo=googleappsscript&logoColor=4285F4)
![Hosting](https://img.shields.io/badge/Hosting-Cloudflare%20Pages-010781?style=flat&labelColor=FFF5DF&logo=cloudflare&logoColor=F48120)
![License](https://img.shields.io/badge/License-MIT-010781?style=flat&labelColor=FFF5DF&logo=opensourceinitiative&logoColor=2E7D32)

[Live Demo](https://dogscbr-firstwalk-pawpal.pages.dev) • [Screenshots](#screenshots) • [The Problem](#the-problem) • [Features](#features) • [How It Works](#how-it-works) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [Staff Setup Guide](#staff-setup-guide)

</div>

---

## Screenshots

## Screenshots

### Apply

<img width="100%" alt="PawPal application form" src="https://github.com/user-attachments/assets/f9d3c295-bfb9-4505-af87-fbddac60343c" />

### Interactive OHS Quiz

<img width="100%" alt="PawPal interactive OHS quiz" src="https://github.com/user-attachments/assets/db4ccc1f-4281-4777-b2a4-5d62af4332dd" />

### Membership Confirmation

<img width="100%" alt="PawPal membership confirmation" src="https://github.com/user-attachments/assets/1b3a78ed-bbe2-4b2e-8a9a-cbebdc435d8f" />

## The Problem

DogsCBR's Community Walking Program runs through one person. The Community
Manager reviews every application by hand, emails out the induction
document, OHS guidelines and quiz link one at a time, manually checks quiz
scores, chases signed forms, and updates the register herself. Every step
before the first walk is a fixed, rule-based check, not a judgement call —
it doesn't need a person doing it manually.

## Features

- 🐕 **Guided application flow** — basic details, induction agreement, OHS
  guidelines, ID verification and e-signature, all in one continuous journey
  instead of a form-and-email loop
- 🎮 **Interactive OHS quiz** — drag-and-drop and tap interactions with
  instant feedback pulled straight from DogsCBR's own guidelines, not a
  static Google Form
- ✍️ **Digital signature** — added mid-project after DogsCBR saw the
  prototype and asked for it
  guidelines only; never touches the pass/fail decision
- 📇 **Auto-issued membership card** — a Community Member number generated
  the moment an application is approved
- 📱 **Fully responsive** — sidebar step tracker on desktop, bottom sheet
  navigation on mobile

## How It Works

| Step | Route                 | What happens                                                                                                                |
| ---- | --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 1    | `/`                   | Name, email, phone, DOB. Branches for under-18 (guardian details) and accessibility notes, per DogsCBR's existing OHS rules |
| 2    | `/apply/induction`    | DogsCBR's Community Induction Guide (rights, responsibilities, privacy policy) as an accordion                              |
| 3    | `/apply/ohs-guide`    | The OHS Guidelines as a swipeable card deck                                                                                 |
| 4    | `/apply/quiz`         | The OHS quiz, one question at a time, with instant feedback and unlimited retries. 100% required to proceed                 |
| 5    | `/apply/id-upload`    | Photo ID upload, stored privately in Drive                                                                                  |
| 6    | `/apply/signature`    | Digital signature on the Induction Form                                                                                     |
| 7    | `/apply/confirmation` | Assigned Community Member number, plus a reminder that the first walk is staff-supervised                                   |

On submission, a Google Apps Script backend writes the application straight
into DogsCBR's existing Google Sheet, files the ID and signature in Drive,
and sends two automated emails — one to staff, one to the applicant.

## Tech Stack

| Layer         | Choice                           | Why                                                                                 |
| ------------- | -------------------------------- | ----------------------------------------------------------------------------------- |
| Frontend      | React + Vite                     | Fast dev loop, small hackathon-friendly bundle                                      |
| Styling       | Tailwind CSS                     | Matches DogsCBR's own brand palette directly                                        |
| Animation     | Framer Motion, `canvas-confetti` | The fun, interactive feel the quiz needed                                           |
| Signature     | `signature_pad`                  | Reliable canvas-based e-signature capture                                           |
| Backend       | Google Apps Script               | Zero servers, zero cost, runs inside Workspace DogsCBR already uses                 |
| Hosting       | Cloudflare Pages                 | Free tier, auto-deploys on every push to `main`                                     |
| AI (optional) | Gemini API                       | Free tier, called server-side from Apps Script so the key never reaches the browser |

We deliberately built the backend inside Google Workspace instead of moving
DogsCBR onto new infrastructure — they already use Sheets, Drive and Gmail,
so a volunteer team can keep running this without a developer on call, and
AI is kept out of the actual approval decision entirely.

## Getting Started

```bash
npm install
npm run dev
```

Without `VITE_APPS_SCRIPT_URL` set, submission falls back to a local mock so
the whole flow is demoable offline. Copy `.env.example` to `.env` and fill
it in once the backend is deployed.

## Staff Setup Guide

**DogsCBR staff — this is for you.** [`backend/README.md`](backend/README.md)
is a full, non-technical, start-to-finish guide to setting up the Google
Sheet, Apps Script and Drive folders yourself, with no coding required.

## License

Code is licensed under [MIT](LICENSE). The DogsCBR name, logo and brand
assets in `src/assets/` are the property of Dogs Canberra and are not
covered by this license.
