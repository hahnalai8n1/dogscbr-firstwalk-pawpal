// Talks to the Google Apps Script Web App (see /backend/Code.gs).
// Set VITE_APPS_SCRIPT_URL in .env once the script is deployed; until then
// submission falls back to a local mock so the wizard is fully demoable offline.
const ENDPOINT = import.meta.env.VITE_APPS_SCRIPT_URL;

function mockCmNumber() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `CM${n}`;
}

export async function submitApplication(payload) {
  if (!ENDPOINT) {
    console.warn("[api] VITE_APPS_SCRIPT_URL not set — using local mock response.");
    await new Promise((r) => setTimeout(r, 900));
    return { ok: true, cmNumber: mockCmNumber() };
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    // Apps Script web apps don't support custom request headers on simple
    // deployments without preflight issues, so we keep this a "simple" CORS request.
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`Submission failed (${res.status})`);
  return res.json();
}

const MOCK_ANSWERS = [
  "Guide dog says: check the cards above — that's exactly where I keep my best advice!",
  "Woof! I'm just a mock response right now (no backend hooked up yet), but a real answer would land here.",
];

export async function askGuidelines(question) {
  if (!ENDPOINT) {
    await new Promise((r) => setTimeout(r, 600));
    return MOCK_ANSWERS[Math.floor(Math.random() * MOCK_ANSWERS.length)];
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "ask", question }),
  });

  if (!res.ok) throw new Error(`Ask failed (${res.status})`);
  const data = await res.json();
  return data.answer;
}
